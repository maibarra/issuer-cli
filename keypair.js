const fs = require("fs");
const bs58 = require("bs58");
const forge = require("node-forge");
const { RSAKeyPair } = require("jsonld-signatures");

async function create(keyName) {
  const rsa = await RSAKeyPair.generate();
  const key = {
    privateKeyPem: rsa.privateKeyPem,
    publicKeyPem: rsa.publicKeyPem,
  };
  save(key, keyName);
}

function b58topem(b58key, type) {
  const decoded = bs58.decode(b58key);
  return buffer2Keytype(decoded, type);
}

function buffer2Pemtype(buf, type) {
  const header = `-----BEGIN ${type.toUpperCase()} KEY-----\n`;
  const footer = `\n-----END ${type.toUpperCase()} KEY-----\n`;
  const keyB64 = decoded.toString("base64");
  return header + keyB64 + footer;
}

function save(key, keyName) {
  const keyDir = "./keys/" + keyName;
  fs.mkdirSync(keyDir, { recursive: true });
  fs.writeFileSync(keyDir + "/private.pem", key.privateKeyPem);
  fs.writeFileSync(keyDir + "/public.pem", key.publicKeyPem);
}

function load(keyName) {
  const keyDir = "./keys/" + keyName;
  const publicKeyPem = fs.readFileSync(keyDir + "/public.pem");
  const privateKeyPem = fs.readFileSync(keyDir + "/private.pem");
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  return { publicKey, privateKey, publicKeyPem, privateKeyPem };
}

module.exports = { create, buffer2Pemtype, b58topem, save, load };
