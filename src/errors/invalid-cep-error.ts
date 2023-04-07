import { ApplicationError } from '@/protocols';

export function invalidCepError(cep: string): ApplicationError {
  return {
    name: 'InvalidCepError',
    message: `"${cep}" is not a valid CEP!`,
  };
}
