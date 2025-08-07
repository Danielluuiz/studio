#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do FitGenius...\n');

// Verificar se o arquivo .env.local existe
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env.local não encontrado!');
  console.log('📝 Crie o arquivo .env.local na raiz do projeto com as variáveis necessárias.');
  process.exit(1);
}

// Ler o arquivo .env.local
const envContent = fs.readFileSync(envPath, 'utf8');

// Verificar variáveis obrigatórias
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'GOOGLE_API_KEY'
];

const missingVars = [];
const configuredVars = [];

requiredVars.forEach(varName => {
  if (envContent.includes(varName)) {
    const line = envContent.split('\n').find(line => line.startsWith(varName));
    if (line && !line.includes('your_') && !line.includes('sua_')) {
      configuredVars.push(varName);
    } else {
      missingVars.push(varName);
    }
  } else {
    missingVars.push(varName);
  }
});

console.log('📊 Status das Configurações:\n');

if (configuredVars.length > 0) {
  console.log('✅ Variáveis configuradas:');
  configuredVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('');
}

if (missingVars.length > 0) {
  console.log('❌ Variáveis faltando ou não configuradas:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('');
}

// Verificar se o servidor está rodando
const http = require('http');
const options = {
  hostname: 'localhost',
  port: 9002,
  path: '/',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Servidor rodando em http://localhost:9002');
  } else {
    console.log('⚠️  Servidor respondendo, mas com status:', res.statusCode);
  }
});

req.on('error', (err) => {
  console.log('❌ Servidor não está rodando');
  console.log('💡 Execute: npm run dev');
});

req.on('timeout', () => {
  console.log('⏰ Timeout ao conectar com o servidor');
});

req.end();

// Resumo final
console.log('\n📋 Resumo:');
if (missingVars.length === 0) {
  console.log('🎉 Todas as variáveis estão configuradas!');
} else {
  console.log(`⚠️  ${missingVars.length} variável(ões) precisa(m) ser configurada(s)`);
  console.log('📖 Consulte o arquivo SETUP_GUIDE.md para instruções detalhadas');
}

console.log('\n🔗 Links úteis:');
console.log('   - Firebase Console: https://console.firebase.google.com/');
console.log('   - Google AI Studio: https://aistudio.google.com/');
console.log('   - Aplicação: http://localhost:9002'); 