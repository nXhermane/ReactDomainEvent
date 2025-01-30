import { Constructor } from "../types/types";

const instanceManagerKey ="__INSTANCE_MANAGER__"
// Symbol("InstanceManager");

declare global {
  interface GlobalThis {
    [instanceManagerKey]: InstanceManager | null;
  }
}
const getGlobalContext = (): GlobalThis => {
  if (typeof globalThis !== undefined)
    return globalThis as unknown as GlobalThis;
  if (typeof global !== undefined) return global as unknown as GlobalThis;
  if (typeof window !== undefined) return window as unknown as GlobalThis;
  if (typeof self !== undefined) return self as unknown as GlobalThis;
  throw new Error("Impossible de trouver le context global.");
};

/**
 * @class InstanceManager
 * @desc: Gestionnaire d'instance permettant d'enregistrer des instances et de les recuperer grâce a une Key
 */
export default class InstanceManager {
  private instances: Map<string, any> = new Map<string, any>();
  private static insanceCounter: number = 0; // For Debug

  private constructor() {}
  /**
   * Retourne l'instance de InstanceManager
   * @returns retourne l'instance single de InstanceManager
   */
  public static get(): InstanceManager {
    console.log("Recuperation de l'instance ", InstanceManager.insanceCounter);
    const globalContext = getGlobalContext();
    if (!globalContext[instanceManagerKey]) {
      InstanceManager.insanceCounter++;
      console.log("Warn", instanceManagerKey);
      globalContext[instanceManagerKey] = new InstanceManager();
    }
    return globalContext[instanceManagerKey];
  }
  /**
   * Enregistre une instance avec un identifiant specifique ou type
   * @param key Identifiant unique ou le constructeur de la classe
   * @param instance Instance de classe a enregistrer
   */
  register<T>(key: string | Constructor<T>, instance: T): void {
    const keyName = this.getKeyName(key);
    if (this.has(key)) {
      console.warn(
        `Une instance avec la cle ${keyName} a été enregistré. Elle sera remplacée.`
      );
    }
    this.instances.set(keyName, instance);
  }
  /**
   * Resoudre une instance grâce a l'identifiant unique ou type
   * @param key Identifiant unique ou le construteur de la classe
   * @returns Instance Resolue
   * @throws Erreur lorsque l'instance n'est pas trouvé
   */
  resolve<T>(key: string | Constructor<T>): T {
    const keyName = this.getKeyName(key);
    if (!this.has(key)) {
      throw new Error(`Pas d'instance enregistré pour cette key ${keyName}`);
    }
    return this.instances.get(keyName);
  }
  /**
   * Verifie si une instance a ete enregistrer avec son identifiant unique ou type
   * @param key Identifiant unique ou le constructeur de la classe
   * @returns True si l'instance existe et Fasle si non
   */
  has<T>(key: string | Constructor<T>): boolean {
    const keyName = this.getKeyName(key);
    return this.instances.has(keyName);
  }
  /**
   * Supprime l'instance avec sont identifiant unique ou type
   * @param key Identifiant unique ou le constructeur de la classe
   */
  unregister<T>(key: string | Constructor<T>): void {
    const keyName = this.getKeyName(key);
    if (this.instances.delete(keyName)) {
      console.log(`Instance ayant la key: ${keyName} a été supprimée.`);
    } else {
      console.warn(`Aucune instance trouvée avec la key: ${keyName}.`);
    }
  }
  /**
   * Recuperer la key en string
   * @param key
   * @returns la key sous forme de string
   */
  private getKeyName<T>(key: string | Constructor<T>): string {
    return typeof key === "string" ? key : key.name;
  }
}
