export interface Question {
  id: number
  text: string
  points: number
  options: {
    label: string
    text: string
    isCorrect: boolean
  }[]
}

export const examQuestions: Question[] = [
  {
    id: 1,
    text: "El Balance General se define como:",
    points: 2,
    options: [
      {
        label: "a",
        text: "Un estado contable que refleja los ingresos y egresos en un periodo determinado.",
        isCorrect: false,
      },
      {
        label: "b",
        text: "Un estado contable que presenta la situación patrimonial y financiera de la empresa en un momento específico.",
        isCorrect: true,
      },
      {
        label: "c",
        text: "Un estado contable que refleja los aumentos y disminuciones de los componentes del patrimonio neto.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    text: "El estado de resultado se define como:",
    points: 2,
    options: [
      {
        label: "a",
        text: "Un estado contable que refleja los aumentos y disminuciones de los componentes del patrimonio neto.",
        isCorrect: false,
      },
      {
        label: "b",
        text: "Un estado contable que presenta la situación patrimonial y financiera de la empresa en un momento específico.",
        isCorrect: false,
      },
      {
        label: "c",
        text: "Un estado contable que refleja los ingresos y egresos en un periodo determinado.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    text: "El estado de evolución de patrimonio neto se define como:",
    points: 1,
    options: [
      {
        label: "a",
        text: "Un estado contable que refleja los aumentos y disminuciones de los componentes del patrimonio neto.",
        isCorrect: true,
      },
      {
        label: "b",
        text: "Un estado contable que presenta la situación patrimonial y financiera de la empresa en un momento específico.",
        isCorrect: false,
      },
      {
        label: "c",
        text: "Un estado contable que refleja los ingresos y egresos en un periodo determinado.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    text: "Los estados contables se entienden como:",
    points: 2,
    options: [
      {
        label: "a",
        text: "Informes que surgen de registraciones previamente efectuadas en los libros de contabilidad.",
        isCorrect: true,
      },
      {
        label: "c",
        text: "Informes que surgen de registraciones complementarias realizadas fuera de los libros de contabilidad.",
        isCorrect: false,
      },
      {
        label: "d",
        text: "Informes que surgen de registraciones simplificadas incluidas parcialmente en los libros de contabilidad.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    text: "La naturaleza de los Estados Contables proviene de que:",
    points: 2,
    options: [
      {
        label: "a",
        text: "Se basan en el arte de registrar, clasificar, resumir e interpretar los datos económicos.",
        isCorrect: false,
      },
      {
        label: "c",
        text: "Se basan en el arte de registrar, clasificar, resumir e interpretar los datos contables.",
        isCorrect: true,
      },
      {
        label: "d",
        text: "Se basan en el arte de registrar, clasificar, resumir e interpretar los datos patrimoniales.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 6,
    text: "Una limitación de los Estados Contables es que:",
    points: 1,
    options: [
      {
        label: "a",
        text: "Pueden contener descripciones que no se asocian con la economía.",
        isCorrect: false,
      },
      {
        label: "b",
        text: "Pueden contener descripciones que no se relacionan con la realidad.",
        isCorrect: true,
      },
      {
        label: "c",
        text: "Pueden contener descripciones que no se vinculan con las reservas.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 7,
    text: "El Patrimonio Neto se calcula como:",
    points: 1,
    options: [
      {
        label: "a",
        text: "Activo menos Pasivo.",
        isCorrect: true,
      },
      {
        label: "b",
        text: "Activo más Pasivo.",
        isCorrect: false,
      },
      {
        label: "c",
        text: "Pasivo menos Activo.",
        isCorrect: false,
      },
      {
        label: "d",
        text: "Activo dividido Pasivo.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 8,
    text: "Los Bienes de Cambio son:",
    points: 1,
    options: [
      {
        label: "a",
        text: "Bienes destinadas invertidos en activos intangibles.",
        isCorrect: false,
      },
      {
        label: "b",
        text: "Bienes destinados a facilitar la operativa diaria de la empresa.",
        isCorrect: false,
      },
      {
        label: "c",
        text: "Bienes destinadas a la venta, en proceso de producción o utilizadas en la prestación de servicios.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 9,
    text: "El Pasivo Corriente comprende:",
    points: 1,
    options: [
      {
        label: "a",
        text: "Obligaciones cuya liquidación se realizará en un plazo superior a un año.",
        isCorrect: false,
      },
      {
        label: "b",
        text: "Obligaciones cuya liquidación se realizará en un plazo inferior a un año.",
        isCorrect: true,
      },
      {
        label: "c",
        text: "Obligaciones cuya liquidación se realizará en un plazo indeterminado.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 10,
    text: "El Estado de Flujo de Fondos es:",
    points: 2,
    options: [
      {
        label: "a",
        text: "El estado que muestra de dónde provinieron los recursos y en qué reservas se aplicaron.",
        isCorrect: false,
      },
      {
        label: "b",
        text: "El estado que muestra de dónde provinieron los recursos y a qué destino se aplicaron.",
        isCorrect: true,
      },
      {
        label: "c",
        text: "El estado que muestra de dónde provinieron los recursos y qué pasivos se cancelaron.",
        isCorrect: false,
      },
    ],
  },
]

export const TOTAL_POINTS = examQuestions.reduce((sum, q) => sum + q.points, 0)
export const TIME_PER_QUESTION = 10 // seconds
