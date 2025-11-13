export interface QuestionOption {
  text: {
    ar: string;
    en: string;
  };
  score: number;
}

export interface Question {
  text: {
    ar: string;
    en: string;
  };
  options: QuestionOption[];
}

export interface Interpretation {
  minScore: number;
  maxScore: number;
  label: string;
  description: string;
  color: 'green' | 'blue' | 'yellow' | 'orange' | 'red';
}

export interface Scale {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  category: string;
  image: string;
  questions: Question[];
  interpretations: Interpretation[];
  maxScore: number;
  active: boolean;
  updatedAt: string;
}

export interface ScaleForm {
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  category: string;
  image: string;
  questions: Question[];
  interpretations: Interpretation[];
  maxScore: number;
  active: boolean;
}