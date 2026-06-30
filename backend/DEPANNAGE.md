# Guide de dépannage - MySQL

## Vérifier si MySQL est installé et en cours d'exécution

### Sur Windows

1. Vérifiez si MySQL est installé :
   - Ouvrez le menu Démarrer et recherchez "MySQL"
   - Ou vérifiez dans Program Files/MySQL

2. Vérifiez si le service MySQL est en cours d'exécution :
   ```powershell
   Get-Service | Where-Object {$_.Name -like "*mysql*"}
   ```

3. Si le service existe mais n'est pas en cours d'exécution :
   ```powershell
   Start-Service MySQL80  # Ou le nom de votre service MySQL
   ```

### Si MySQL n'est pas installé

Option 1 : Installer MySQL Community Server
- Téléchargez-le depuis : https://dev.mysql.com/downloads/mysql/

Option 2 : Utiliser XAMPP/WAMP (plus simple pour le développement)
- XAMPP : https://www.apachefriends.org/
- WAMP : https://www.wampserver.com/

## Configuration du fichier .env

Adaptez le fichier `backend/.env` selon votre configuration :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe  # Mettez votre mot de passe root ici
DB_NAME=dapi_pmr
PORT=3001
```

## Si vous utilisez XAMPP/WAMP

1. Démarrez XAMPP/WAMP
2. Assurez-vous que le module MySQL est activé
3. Par défaut, XAMPP utilise :
   - Utilisateur : `root`
   - Mot de passe : (vide)
   - Port : 3306

## Test de connexion simple

Créez un fichier `test-connection.js` dans le dossier `backend` :

```javascript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    console.log('✅ Connexion réussie !');
    await connection.end();
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

test();
```

Puis exécutez :
```bash
node test-connection.js
```
