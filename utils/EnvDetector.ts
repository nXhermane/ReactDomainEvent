
import { Platform } from "react-native";

// Créez une interface simple qui expose les fonctionnalités nécessaires
const EnvDetector = {
  // Détection de la plateforme (iOS, Android, web, etc.)
  getPlatform: () => Platform.OS,
  
  // Vérification si c'est iOS
  isIOS: () => Platform.OS === 'ios',
  
  // Vérification si c'est Android
  isAndroid: () => Platform.OS === 'android',
  
  // Vérification si c'est le web
  isWeb: () => Platform.OS === 'web',
  
  // Obtenir la version de la plateforme
  getVersion: () => Platform.Version,
  
  // Autres méthodes utiles basées sur Platform
  select: (options) => Platform.select(options)
};

export default EnvDetector;