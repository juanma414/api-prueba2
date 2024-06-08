import express from 'express';
import { Character } from './characters.js';
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());
//get /api/characters --> obtener lista de recursos 
//get /api/characters/:id--> obtener un recurso con el id = :id
//post /api/characters --> crea un recurso
//delete /api/characters/:id --> borra un recurso con el id = :id
//put & patch /api/characters/:id--> actualiza un recurso con el id = :id

//character --> /api/characters

const characters = [
    new Character ('Gandalf', 'Wizard', 10, 100, 100, 50, ['Staff', 'Hat']),
];

function sanitizeCharacterInput(req: Request, res: Response, next: NextFunction) {
    
    req.body.sanitizedInput = {
        name: req.body.name,
        characterClass: req.body.characterClass,
        level: req.body.level,
        hp: req.body.hp,
        mana: req.body.mana,
        attack: req.body.attack,
        items: req.body.items,
    }
    //more checks here
    next();
}

app.get('/api/characters/:id', (req, res) => {

    const character = characters.find((character) => character.id === req.params.id)
    if (character) {
        res.json(character);
    } else {
        res.status(404).json({message: 'Character not found'});
    }
})

app.get('/api/characters', (req, res) => {

    res.json(characters);
})

app.post('/api/characters', sanitizeCharacterInput, (req, res) => {
    const input = req.body.sanitizedInput;

    const character = new Character(
        input.name, 
        input.characterClass, 
        input.level, 
        input.hp, 
        input.mana, 
        input.attack, 
        input.items)

    characters.push(character);
    res.status(201).send({message: 'character created', data:character});

})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

app.put('/api/characters/:id', sanitizeCharacterInput, (req, res) => {
    const characterIdx = characters.findIndex((character) => character.id === req.params.id)
    if (characterIdx===-1) {
        res.status(404).send({message: 'Character not found'})
    }
        
        characters[characterIdx] = {...characters[characterIdx],...req.body.sanitizedInput}

        res.status(200).send({message: 'Character updated', data: characters[characterIdx]})
})

app.delete('/api/characters/:id', (req, res) => {
    const characterIdx = characters.findIndex((character) => character.id === req.params.id)

    if (characterIdx===-1) {
        res.status(404).send({message: 'Character not found'})
    }
    characters.splice(characterIdx, 1)
    res.status(200).send({message: 'Character deleted successfully'})
})

app.use((req, res) => {
    return res.status(404).send({message: 'Route '+ req.url + ' Not found'})
})