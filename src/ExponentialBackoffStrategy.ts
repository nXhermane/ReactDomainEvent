import { Constants } from "./constants/constants";
import { PermanentEventHandleFailureError } from "./errors/PermanentEventHandleFailureError";
import { IExponentialBackoffStrategy } from "./interfaces/ExponentialBackOfStategy";

export class ExponentialBackoffStrategy implements IExponentialBackoffStrategy {
    constructor (
        private readonly maxAttemps = Constants.maxAttempts,
        private readonly baseDelay = Constants.baseDelay,
        private readonly maxDelay = Constants.maxDelay
    ){

    }
    shouldRetry(attempts: number, error: Error): boolean {
       // Verifier si l'attempts est inferieur au maxAttempts
       if(attempts>= this.maxAttemps) return false 
       // L'Erreur est permanente lorsque le DeadLetterEchoue au traitement de l'event 
       // Mais cela n'est pas encore implementer dans notre system 
       if(error instanceof PermanentEventHandleFailureError) return false ;
       return true
    }
    getNextRetryDelay(attempts: number): number {
        // Calcule du delay 
        /**
         * delay = min((baseDelay * pow(2,attempts)),maxDelay)
         * Ex: attempts = 1 , baseDelay = 100, = 100* (2**1) = 200
         * attempts = 3 , baseDelay = 100 , = 100 * (2**3) = 800 
         */
        const delay = Math.min(
            this.baseDelay * Math.pow(2, attempts),
            this.maxDelay
          );
          
          // Ajouter un jitter (variation aleatoire) pour éviter le "thundering herd" (surcharge causer par des retries simultanes)
          return delay + (Math.random() * delay * 0.1);
    }

}