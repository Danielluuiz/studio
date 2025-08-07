# 🔧 Configuração do .env.local - FitGenius

## **📋 O que você precisa fazer:**

### **1. 🔥 Configurar Firebase**

**Passo 1:** Acesse [Firebase Console](https://console.firebase.google.com/)

**Passo 2:** Crie um novo projeto:
- Clique em "Criar projeto"
- Nome: `fitgenius` (ou outro nome)
- Siga os passos de configuração

**Passo 3:** Obtenha as configurações:
1. Clique na engrenagem ⚙️ ao lado de "Project Overview"
2. Selecione "Project settings"
3. Role para baixo até "Your apps"
4. Clique em "Add app" e escolha "Web"
5. Copie as configurações

**Passo 4:** Configure Authentication:
1. Vá para "Authentication" > "Get started"
2. Habilite: Email/Password, Google, Apple (opcional)

**Passo 5:** Configure Firestore:
1. Vá para "Firestore Database" > "Create database"
2. Escolha "Start in test mode"
3. Escolha localização mais próxima

### **2. 🤖 Configurar Google AI**

**Passo 1:** Acesse [Google AI Studio](https://aistudio.google.com/)

**Passo 2:** Faça login com sua conta Google

**Passo 3:** Obtenha a API Key:
1. Vá para "API Keys"
2. Clique em "Create API Key"
3. Copie a chave

### **3. 📝 Preencher o .env.local**

Substitua os valores no arquivo `.env.local` pelos seus valores reais:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="sua_api_key_aqui"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="seu_project_id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="seu_project_id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="seu_messaging_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="seu_app_id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="seu_measurement_id"

# Google AI Configuration
GOOGLE_API_KEY="sua_google_api_key_aqui"
```

### **4. 🔍 Exemplo de valores reais:**

```env
# Exemplo (substitua pelos seus valores):
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="fitgenius-12345.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="fitgenius-12345"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="fitgenius-12345.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef1234567890"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-ABCDEF1234"
GOOGLE_API_KEY="AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz"
```

### **5. ✅ Verificar configuração**

Após preencher, execute:

```bash
npm run check-config
```

### **6. 🚀 Testar aplicação**

1. Reinicie o servidor:
   ```bash
   npm run dev
   ```

2. Acesse: `http://localhost:9002`

3. Teste as funcionalidades:
   - ✅ Criar conta/Fazer login
   - ✅ Preencher perfil
   - ✅ Gerar plano de treino
   - ✅ Gerar plano alimentar
   - ✅ Usar assistente virtual

---

**🎯 Status Atual:** Aguardando configuração das variáveis de ambiente
**🔧 Próximo Passo:** Preencher o .env.local com suas chaves reais 