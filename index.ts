import express, { Request, Response } from 'express';
import crypto from 'crypto';


type FileObject = {
    content: string;
    owner: string;
    users: string[];
    passphrase: string; 
};

const app = express();
app.use(express.json());

// Temporary storage 
let users: { [username: string]: string } = {};
let files: { [fileId: string]: FileObject } = {};


// Routes

// 1. Register User
app.post('/register', (req: Request, res: Response) => {
    const { username } = req.body;
    if (!username || users[username]) {
        return res.status(400).json({ message: 'Username is invalid or already taken' });
    }

    
    
    
    
    res.json({ message: 'User registered successfully' });
});

//2. Creating text Files
app.post('/files', (req: Request, res: Response) => {
    const { content } = req.body;
    const username: string | undefined = req.query.username as string | undefined; // Extract username from query parameters

   
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    
    const passphrase = crypto.randomBytes(32).toString('hex');

    const encryptionKey = crypto.scryptSync(passphrase, 'salt', 32);

   
    const iv = crypto.randomBytes(16);

    
    const cipher = crypto.createCipheriv('aes-256-ctr', encryptionKey, iv);
    let encryptedContent = cipher.update(content, 'utf8', 'hex');
    encryptedContent += cipher.final('hex');

    
    const encryptedContentWithIV = iv.toString('hex') + encryptedContent;

    // Storing encrypted file
    const fileId = crypto.randomBytes(16).toString('hex');
    files[fileId] = { content: encryptedContentWithIV, owner: username, users: [username], passphrase };

    res.json({ message: 'File created successfully', fileId });
});




// 3. Add User to File
app.post('/files/:fileId/add-user', (req: Request, res: Response) => {
    const { fileId } = req.params;
    const { username } = req.body;

    
    files[fileId].users.push(username);

    res.json({ message: 'User added successfully' });
});

//4. Retrieving Files

app.get('/files', (req: Request, res: Response) => {
    const username = req.query.username as string | undefined;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    
    const decryptedFiles: any[] = [];

    Object.entries(files).forEach(([fileId, file]) => {
        
        if (file.owner === username || (file.users && file.users.includes(username))) {
            try {
                
                const encryptionKey = crypto.scryptSync(file.passphrase, 'salt', 32);

              
                const iv = Buffer.from(file.content.slice(0, 32), 'hex');

               
                const decipher = crypto.createDecipheriv('aes-256-ctr', encryptionKey, iv);
                let decryptedContent = decipher.update(file.content.slice(32), 'hex', 'utf8');
                decryptedContent += decipher.final('utf8');
                
                decryptedFiles.push({ ...file, fileId, content: decryptedContent });
            } catch (error) {
               
                decryptedFiles.push({ ...file, fileId, content: '[Decryption Error]' });
            }
        } else {
           
            decryptedFiles.push({ ...file, fileId, content: '[Encrypted]' });
        }
    });

    res.json(decryptedFiles);
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
