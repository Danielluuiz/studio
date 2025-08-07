# 🔐 Resolver Problema de Autenticação Firebase

## **❌ Erro: "Firebase: Error (auth/operation-not-allowed)"**

Este erro acontece porque os métodos de autenticação não estão habilitados no Firebase Console.

### **🔧 Solução:**

1. **Acesse o Firebase Console:**
   - Vá para [Firebase Console](https://console.firebase.google.com/)
   - Selecione seu projeto `fitgenius-x5gaa`

2. **Configure Authentication:**
   - No menu lateral, clique em "Authentication"
   - Clique em "Get started" (se ainda não configurou)
   - Vá para a aba "Sign-in method"

3. **Habilite os métodos de login:**
   - **Email/Password:**
     - Clique em "Email/Password"
     - Marque a caixa "Enable"
     - Clique em "Save"
   
   - **Google:**
     - Clique em "Google"
     - Marque a caixa "Enable"
     - Selecione um "Project support email"
     - Clique em "Save"
   
   - **Apple (opcional):**
     - Clique em "Apple"
     - Marque a caixa "Enable"
     - Configure se necessário
     - Clique em "Save"

4. **Configure Firestore Database:**
   - No menu lateral, vá para "Firestore Database"
   - Clique em "Create database"
   - Escolha "Start in test mode"
   - Escolha localização (ex: `us-central1`)
   - Clique em "Done"

5. **Configure as regras do Firestore:**
   - Na seção Firestore, vá para a aba "Rules"
   - Substitua as regras por:

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

6. **Clique em "Publish"**

### **✅ Após configurar:**

1. Reinicie o servidor:
   ```bash
   npm run dev
   ```

2. Teste o login novamente

---

**🎯 Status:** Aguardando configuração do Authentication
**🔧 Próximo:** Habilitar métodos de login no Firebase Console
