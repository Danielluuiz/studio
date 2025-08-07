# 🚀 Guia de Configuração Completa - FitGenius

## **Problemas Identificados e Soluções**

### **1. 🔧 Configuração das Variáveis de Ambiente**

**Problema:** O arquivo `.env.local` está vazio, impedindo o funcionamento do Firebase e Google AI.

**Solução:** Configure as seguintes variáveis no arquivo `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua_firebase_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id

# Google AI Configuration
GOOGLE_API_KEY=sua_google_api_key_aqui
```

### **2. 🔥 Configuração do Firebase**

#### **Passo 1: Criar Projeto Firebase**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar projeto"
3. Digite o nome: `fitgenius` (ou outro nome)
4. Siga os passos de configuração

#### **Passo 2: Configurar Authentication**
1. No console do Firebase, vá para "Authentication"
2. Clique em "Get started"
3. Vá para a aba "Sign-in method"
4. Habilite:
   - ✅ Email/Password
   - ✅ Google
   - ✅ Apple (opcional)

#### **Passo 3: Configurar Firestore Database**
1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Escolha a localização mais próxima

#### **Passo 4: Obter Configurações**
1. No console do Firebase, clique na engrenagem (⚙️) ao lado de "Project Overview"
2. Selecione "Project settings"
3. Role para baixo até "Your apps"
4. Clique em "Add app" e escolha "Web"
5. Copie as configurações para o `.env.local`

#### **Passo 5: Configurar Regras do Firestore**
No console do Firebase, vá para "Firestore Database" > "Rules" e configure:

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

### **3. 🤖 Configuração da Google AI**

#### **Passo 1: Obter API Key**
1. Acesse [Google AI Studio](https://aistudio.google.com/)
2. Faça login com sua conta Google
3. Vá para "API Keys"
4. Clique em "Create API Key"
5. Copie a chave para o `.env.local`

### **4. 🧪 Testando a Configuração**

Após configurar tudo:

1. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse:** `http://localhost:9002`

3. **Teste as funcionalidades:**
   - ✅ Criar conta/Fazer login
   - ✅ Preencher perfil
   - ✅ Gerar plano de treino
   - ✅ Gerar plano alimentar
   - ✅ Usar assistente virtual

### **5. 🔍 Verificação de Funcionamento**

#### **✅ Se tudo estiver funcionando:**
- Login/registro funcionando
- Perfil salva no Firebase
- IA gera planos de treino
- IA gera planos alimentares
- Assistente virtual responde

#### **❌ Se houver problemas:**
- Verifique as variáveis de ambiente
- Confirme se o Firebase está configurado
- Verifique se a Google AI API Key está correta
- Consulte o console do navegador para erros

### **6. 🚀 Deploy (Opcional)**

Para fazer deploy:

1. **Vercel (Recomendado):**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configurar variáveis de ambiente no Vercel:**
   - Vá para o dashboard do Vercel
   - Selecione seu projeto
   - Vá para "Settings" > "Environment Variables"
   - Adicione todas as variáveis do `.env.local`

### **7. 📱 Funcionalidades Disponíveis**

Após a configuração, você terá acesso a:

- 🔐 **Autenticação:** Login/registro com email, Google, Apple
- 👤 **Perfil:** Formulário completo de dados do usuário
- 💪 **Plano de Treino IA:** Geração personalizada de treinos
- 🍎 **Plano Alimentar IA:** Sugestões de refeições semanais
- 📊 **Acompanhamento:** Gráficos de progresso
- 🤖 **Assistente Virtual:** Chat com IA para dúvidas

### **8. 🆘 Suporte**

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Confirme se todas as variáveis estão configuradas
3. Teste cada funcionalidade individualmente
4. Verifique se o Firebase está funcionando

---

**🎯 Status Atual:** Servidor rodando na porta 9002 ✅
**🔧 Próximo Passo:** Configurar variáveis de ambiente 