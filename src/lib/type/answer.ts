export interface answerInterface{
    format: answerFormatType,
    counts: number,
}

export type correctAnswerType = string | number

export type answerFormatType = "select" | "input" | "textarea"


export interface questionDataDto {
    subjectName: string;
    title: string;
    comment: string;
    content: string;
    answerSheet: answerInterface[];
    correctAnswer: correctAnswerType[];
    id?: number;
}

export interface questionListDto{
    id: number,
    subjectName: string,
    title: string,
    createdAt: Date
}

export interface studentDto{
    number: number,
    name: string
}
