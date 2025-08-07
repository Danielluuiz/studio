# Configuração do Firebase

Para que o perfil funcione corretamente, você precisa configurar o Firebase. Siga estes passos:

## 1. Criar projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar projeto"
3. Digite o nome do projeto (ex: "fitgenius")
4. Siga os passos de configuração

## 2. Configurar Authentication

1. No console do Firebase, vá para "Authentication"
2. Clique em "Get started"
3. Vá para a aba "Sign-in method"
4. Habilite:
   - Email/Password
   - Google
   - Apple (opcional)

## 3. Configurar Firestore Database

1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Escolha a localização mais próxima

## 4. Obter configurações

1. No console do Firebase, clique na engrenagem (⚙️) ao lado de "Project Overview"
2. Selecione "Project settings"
3. Role para baixo até "Your apps"
4. Clique em "Add app" e escolha "Web"
5. Copie as configurações

## 5. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

## 6. Regras do Firestore

Configure as regras do Firestore para permitir leitura/escrita:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 7. Testar

Após configurar tudo:

1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Acesse `http://localhost:9002`
3. Tente criar uma conta ou fazer login
4. Verifique se o perfil carrega corretamente

## Problemas comuns

- **"Carregando perfil..." infinito**: Verifique se as variáveis de ambiente estão corretas
- **Erro de autenticação**: Verifique se o Authentication está habilitado no Firebase
- **Erro de permissão**: Verifique as regras do Firestore 