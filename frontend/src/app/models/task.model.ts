export interface Task {
    orderIndex: number
    description: string
    title: string
    department: string
    formlyConfigJson?: FormlyConfigJson | null
    taskId: number
    status: string
}

export interface FormlyConfigJson {
    formTitle?: string
    formControls?: FormControl[]
}

export interface FormControl {
    name: string
    label: string
    type: string
    placeholder?: string
    class: string
    options?: Option[]
    templateOptions?: TemplateOptions
    validators?: Validator[]
}
export interface TemplateOptions {
    text: string
    url: string
}
export interface Option {
    label: string
    value: string
}
export interface Validator {
    validatorName: string
    pattern?: string
    message: string
    required?: boolean
    minLength?: number
    maxLength?: number
    allowedExtensions?: string[]
}
