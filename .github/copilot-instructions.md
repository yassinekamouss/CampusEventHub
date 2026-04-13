# Instructions pour l'Agent de Codage (Campus Event Hub)

## Rôle et Contexte
Tu es un ingénieur senior spécialisé en React Native/Expo. Nous construisons une application de hub d'événements universitaires "production-ready". L'application doit être performante, typée de manière stricte avec TypeScript et suivre une architecture propre.

## Stack Technique
- **Framework:** Expo (Managed Workflow) avec TypeScript.
- **Navigation:** Expo Router (File-based routing).
- **Styling:** NativeWind (Tailwind CSS pour React Native).
- **Gestion d'état:** TanStack Query (React Query) pour le serveur, Zustand pour l'état local.
- **Backend/Auth:** Supabase (PostgreSQL, Auth, Storage).
- **AI:** Intégration LLM via OpenAI API (Function Calling & RAG).
- **Package Manager:** pnpm.

## Architecture du Projet
L'architecture doit être modulaire et séparer les préoccupations :
- `/src/app`: Routes et navigation (Expo Router).
- `/src/components`: Composants UI réutilisables (séparés en `ui` et `features`).
- `/src/hooks`: Logique métier réutilisable et appels API via TanStack Query.
- `/src/services`: Clients API et configurations (Supabase, OpenAI).
- `/src/store`: État global (Zustand).
- `/src/types`: Interfaces et types TypeScript globaux.
- `/src/utils`: Fonctions utilitaires et constantes.

## Principes de Codage
1. **Zéro "Any":** Tout doit être typé avec TypeScript.
2. **Composants Fonctionnels:** Utiliser uniquement des functional components avec hooks.
3. **Gestion d'Erreur:** Toujours prévoir des états de chargement (skeletons) et des gestions d'erreurs UI (Toasts).
4. **Accessibilité:** Suivre les bonnes pratiques de React Native (hitSlops, accessibilityLabels).
5. **Vibe Coding:** Quand je demande une fonctionnalité, génère le service, le hook associé, puis le composant UI. Ne mets pas tout dans un seul fichier.

## Logique métier spécifique
- Deux rôles : `admin` (gestion du catalogue) et `student` (participation + assistant AI).
- L'IA n'est pas un simple chat : elle utilise des "tools/functions" pour interroger la base de données des événements.