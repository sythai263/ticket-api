import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator'

export function IsPassword (
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return (object: any, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate (value: string, _args: ValidationArguments) {
          return /^[a-zA-Z0-9!@#$%^&*]*$/.test(value)
        }
      }
    })
  }
}
