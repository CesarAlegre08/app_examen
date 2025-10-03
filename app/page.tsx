"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { examQuestions, TIME_PER_QUESTION } from "@/lib/exam-data"
import { Clock, CheckCircle2, XCircle } from "lucide-react"

type ExamState = "registration" | "exam" | "completed"
type FeedbackState = "correct" | "incorrect" | null

export default function ExamPage() {
  const router = useRouter()
  const [examState, setExamState] = useState<ExamState>("registration")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [feedback, setFeedback] = useState<FeedbackState>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user already completed the exam
  useEffect(() => {
    const completed = localStorage.getItem("exam_completed")
    if (completed === "true") {
      setExamState("completed")
    }
  }, [])

  // Timer countdown
  useEffect(() => {
    if (examState !== "exam" || feedback !== null) return

    if (timeLeft === 0) {
      handleTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, examState, feedback])

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return

    setExamState("exam")
    setStartTime(Date.now())
    setTimeLeft(TIME_PER_QUESTION)
  }

  const handleTimeUp = () => {
    // Time's up, mark as invalid and move to next
    setFeedback("incorrect")
    setTimeout(() => {
      moveToNextQuestion()
    }, 1500)
  }

  const handleAnswerSelect = (value: string) => {
    if (feedback !== null) return // Prevent changing answer after submission
    setSelectedAnswer(value)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const question = examQuestions[currentQuestion]
    const selectedOption = question.options.find((opt) => opt.label === selectedAnswer)
    const isCorrect = selectedOption?.isCorrect || false

    // Save answer
    setAnswers((prev) => ({
      ...prev,
      [question.id]: selectedAnswer,
    }))

    // Show feedback
    setFeedback(isCorrect ? "correct" : "incorrect")

    // Move to next question after delay
    setTimeout(() => {
      moveToNextQuestion()
    }, 1500)
  }

  const moveToNextQuestion = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setFeedback(null)
      setTimeLeft(TIME_PER_QUESTION)
    } else {
      submitExam()
    }
  }

  const submitExam = async () => {
    setIsSubmitting(true)
    const endTime = Date.now()
    const totalTimeSeconds = Math.floor((endTime - startTime) / 1000)

    // Calculate score
    let score = 0
    examQuestions.forEach((question) => {
      const userAnswer = answers[question.id]
      if (userAnswer) {
        const selectedOption = question.options.find((opt) => opt.label === userAnswer)
        if (selectedOption?.isCorrect) {
          score += question.points
        }
      }
    })

    try {
      const supabase = createClient()
      const { error } = await supabase.from("exam_submissions").insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        score: score,
        total_time_seconds: totalTimeSeconds,
        answers: answers,
      })

      if (error) throw error

      // Mark as completed in localStorage
      localStorage.setItem("exam_completed", "true")
      setExamState("completed")
    } catch (error) {
      console.error("[v0] Error submitting exam:", error)
      alert("Hubo un error al enviar el examen. Por favor, contacta al administrador.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (examState === "completed") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-balance">Gracias por contestar las preguntas</CardTitle>
              <CardDescription className="text-lg mt-4">Tu examen ha sido enviado exitosamente</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <CheckCircle2 className="w-20 h-20 mx-auto text-green-600 mb-4" />
              <p className="text-muted-foreground">
                Los resultados serán revisados y publicados por la docente CPN. Mireya Lissett Céspedes Vega
              </p>
            </CardContent>
          </Card>
        </div>
        <footer className="bg-background border-t py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Derechos reservados - Cesar Joaquin Alegre Baez
          </div>
        </footer>
      </div>
    )
  }

  if (examState === "registration") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Parcial de Estados Contables (EECC)</CardTitle>
              <CardDescription>Por favor, ingresa tus datos para comenzar el examen</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStartExam} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Tu nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Tu apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-blue-900">Instrucciones:</p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>10 preguntas en total</li>
                    <li>10 segundos por pregunta</li>
                    <li>Solo puedes realizar el examen una vez</li>
                    <li>No podrás volver atrás</li>
                  </ul>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Comenzar Examen
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <footer className="bg-background border-t py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Derechos reservados - Cesar Joaquin Alegre Baez
          </div>
        </footer>
      </div>
    )
  }

  const question = examQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / examQuestions.length) * 100

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Pregunta {currentQuestion + 1} de {examQuestions.length}
              </div>
              <div
                className={`flex items-center gap-2 font-mono text-lg font-bold ${
                  timeLeft <= 3 ? "text-red-600" : "text-foreground"
                }`}
              >
                <Clock className="w-5 h-5" />
                {timeLeft}s
              </div>
            </div>
            <Progress value={progress} className="mb-4" />
            <CardTitle className="text-xl font-bold text-balance">{question.text}</CardTitle>
            <CardDescription>
              Valor: {question.points} {question.points === 1 ? "punto" : "puntos"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer || ""}
              onValueChange={handleAnswerSelect}
              disabled={feedback !== null}
              className="space-y-3"
            >
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option.label
                const showFeedback = feedback !== null && isSelected

                return (
                  <div
                    key={option.label}
                    className={`flex items-start space-x-3 border rounded-lg p-4 transition-all ${
                      showFeedback
                        ? feedback === "correct"
                          ? "bg-green-50 border-green-500"
                          : "bg-red-50 border-red-500"
                        : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={option.label} id={option.label} className="mt-1" />
                    <Label htmlFor={option.label} className="flex-1 cursor-pointer leading-relaxed">
                      <span className="font-semibold">{option.label})</span> {option.text}
                    </Label>
                    {showFeedback && (
                      <div className="mt-1">
                        {feedback === "correct" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </RadioGroup>

            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || feedback !== null || isSubmitting}
              className="w-full mt-6"
              size="lg"
            >
              {isSubmitting
                ? "Enviando..."
                : currentQuestion === examQuestions.length - 1
                  ? "Finalizar Examen"
                  : "Siguiente Pregunta"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <footer className="bg-background border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Derechos reservados - Cesar Joaquin Alegre Baez
        </div>
      </footer>
    </div>
  )
}
