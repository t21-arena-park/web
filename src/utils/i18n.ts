export type AthleteGender = 'male' | 'female' | 'MALE' | 'FEMALE'

export const genderMap: Record<AthleteGender, string> = {
  male: 'Masculino',
  female: 'Feminino',
  MALE: 'Masculino',
  FEMALE: 'Feminino',
}

export type AthleteHandedness = 'left' | 'right' | 'LEFT' | 'RIGHT'

export const handednessMap: Record<AthleteHandedness, string> = {
  left: 'Canhoto',
  right: 'Destro',
  LEFT: 'Canhoto',
  RIGHT: 'Destro',
}

export type AthleteBloodType =
  | 'a_positive'
  | 'a_negative'
  | 'b_positive'
  | 'b_negative'
  | 'ab_positive'
  | 'ab_negative'
  | 'o_positive'
  | 'o_negative'
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE'

export const bloodTypeMap: Record<AthleteBloodType, string> = {
  o_positive: 'O+',
  o_negative: 'O-',
  a_positive: 'A+',
  a_negative: 'A-',
  b_positive: 'B+',
  b_negative: 'B-',
  ab_positive: 'AB+',
  ab_negative: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
}

export type AthleteArea =
  | 'unspecified'
  | 'psychology'
  | 'physiotherapy'
  | 'nutrition'
  | 'nursing'
  | 'psychopedagogy'
  | 'physical_education'
  | 'UNSPECIFIED'
  | 'PSYCHOLOGY'
  | 'PHYSIOTHERAPY'
  | 'NUTRITION'
  | 'NURSING'
  | 'PSYCHOPEDAGOGY'
  | 'PHYSICAL_EDUCATION'

export const areaMap: Record<AthleteArea, string> = {
  unspecified: 'Não especificado',
  psychology: 'Psicologia',
  physiotherapy: 'Fisioterapia',
  nutrition: 'Nutrição',
  nursing: 'Enfermagem',
  psychopedagogy: 'Psicopedagogia',
  physical_education: 'Educação Física',
  UNSPECIFIED: 'Não especificado',
  PSYCHOLOGY: 'Psicologia',
  PHYSIOTHERAPY: 'Fisioterapia',
  NUTRITION: 'Nutrição',
  NURSING: 'Enfermagem',
  PSYCHOPEDAGOGY: 'Psicopedagogia',
  PHYSICAL_EDUCATION: 'Educação Física',
}
