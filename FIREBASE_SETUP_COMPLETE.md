# 🔥 Configuração Completa do Firebase

## **✅ Firebase já configurado! Agora vamos completar:**

### **1. 🔐 Configurar Authentication**

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto `fitgenius-x5gaa`
3. Vá para "Authentication" no menu lateral
4. Clique em "Get started"
5. Vá para a aba "Sign-in method"
6. Habilite os métodos:
   - ✅ **Email/Password** (clique em "Enable")
   - ✅ **Google** (clique em "Enable")
   - ✅ **Apple** (opcional)

### **2. 🗄️ Configurar Firestore Database**

1. No menu lateral, vá para "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: `us-central1`)
5. Clique em "Done"

### **3. 📝 Configurar Regras do Firestore**

1. Na seção Firestore Database, vá para a aba "Rules"
2. Substitua as regras por:

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

3. Clique em "Publish"

### **4. 🤖 Obter Google AI API Key**

1. Acesse [Google AI Studio](https://aistudio.google.com/)
2. Faça login com sua conta Google
3. Vá para "API Keys" no menu lateral
4. Clique em "Create API Key"
5. Copie a chave gerada

### **5. 📝 Atualizar .env.local**

Adicione a Google AI API Key ao arquivo `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyAqXQIjDaFrj45YsVGMGvYRtNBHpalePsk"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="fitgenius-x5gaa.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="fitgenius-x5gaa"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="fitgenius-x5gaa.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="509900238668"
NEXT_PUBLIC_FIREBASE_APP_ID="1:509900238668:web:209c700d4ff8efad36e9e9"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""

# Google AI Configuration
GOOGLE_API_KEY="sua_google_api_key_aqui"
```

### **6. ✅ Testar Configuração**

1. Execute o verificador:
   ```bash
   npm run check-config
   ```

2. Reinicie o servidor:
   ```bash
   npm run dev
   ```

3. Acesse: `http://localhost:9002`

4. Teste as funcionalidades:
   - ✅ Criar conta/Fazer login
   - ✅ Preencher perfil
   - ✅ Gerar plano de treino
   - ✅ Gerar plano alimentar
   - ✅ Usar assistente virtual

---

**🎯 Status:** Firebase configurado ✅
**🔧 Próximo:** Completar configuração do Authentication e Firestore 