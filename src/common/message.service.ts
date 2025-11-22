import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  private messages = new Map<string, string>();

  constructor() {
    this.messages.set('getAlluser200', 'Usuarios obtenidos correctamente');
    this.messages.set('getAllUser404', 'No se encontraron usuarios');
    this.messages.set('controllerUser404', 'Usuario no encontrado');
    this.messages.set('AddAsyncUser201', 'Usuario creado correctamente');
    this.messages.set('AddAsyncUser409', 'Email o username ya registrados');
    this.messages.set('ChangePasswordAsyncUser200', 'Contraseña actualizada');
    this.messages.set('ChangePasswordAsyncUser400', 'Contraseña incorrecta');
  }

  get(key: string) {
    return this.messages.get(key) ?? key;
  }
}
