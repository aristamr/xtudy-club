import PresenteCore

// Nombres de PresenteCore re-exportados al módulo de la app: evitan choques con otros `Platform`
// y permiten que las pruebas (que solo importan la app) usen estos tipos.
typealias PlatformID = PresenteCore.Platform
typealias EntitlementState = PresenteCore.EntitlementState
typealias PurchaseRules = PresenteCore.PurchaseRules
typealias Plan = PresenteCore.Plan
typealias TrialTerms = PresenteCore.TrialTerms
