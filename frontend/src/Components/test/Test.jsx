import React, { useState, useEffect } from 'react';
import forge from 'node-forge';

import { API_BASE_URL } from '../../Constants';
const Test = () => {
    let plain = "Hello World";
    // const [publicKey, setPublicKey] = useState('');
    // const [privateKey, setPrivateKey] = useState('');
     function  encryptData(plainText, publicKey) {
        const publicKeyObject = forge.pki.publicKeyFromPem(publicKey);
        const encrypted = publicKeyObject.encrypt(plainText, 'RSA-OAEP');
        return forge.util.encode64(encrypted);
      }
      
       function decryptData(encryptedText, privateKeyObject) {
        const encrypted = forge.util.decode64(encryptedText);
        const decrypted = privateKeyObject.decrypt(encrypted, 'RSA-OAEP');
        return decrypted;
      }

      const handleEncDec =  () => {
        const publicKeyUrl = API_BASE_URL + "media/keys/public_rsa_harprit_1.pem";
        const privateKeyUrl = API_BASE_URL + "media/keys/private_rsa_harprit_1.pem";
        Promise.all([fetch(publicKeyUrl), fetch(privateKeyUrl)])
        .then(responses => {
          return Promise.all(responses.map(response => response.text()));
        })
        .then(pemStrings => {
          const publicKeyPem = pemStrings[0];
          const privateKeyPem = pemStrings[1];
        //   console.log(publicKeyPem)
        //   console.log(privateKeyPem)
        let plainText = "Hello-World!Heieajlkjfalkjdfakfja;kjfdalkjflkajfofijaeiojfakjdfakldflkalkdfjakldjfakljdfkajklfdjalkdfjaljflkajdkldfjaklfjioiejajlalalalall"
        const encryptedText =   encryptData(plainText,publicKeyPem);
        const decryptedText =  decryptData(encryptedText, privateKeyPem);
            
        console.log(encryptedText)
        console.log(decryptedText)
          
        })
        .catch(error => {
          console.error(error);
        });
        



      }

  return (
    <div>
        <button onClick={handleEncDec}>Hiii</button>
    </div>
  )
}

export default Test