import * as fs from 'node:fs/promises';
interface Reader {
    read():Promise<string>
}

class FileReader implements Reader{
    constructor(private filename:string) {
    }

    public async read(){
        const data = await fs.readFile(this.filename)
        return data.toString();
    }
}

class ApiReader implements Reader {
    constructor(private url:string) {
    }

    public read(){
        // fetching implementation
        const fetchedData = "fetched DATA"
        return Promise.resolve(fetchedData)
    }
}

abstract class ReaderDecorator implements Reader{
    constructor(protected fileReader:Reader) {
    }
    public abstract read():Promise<string>
}

class ToLowerCaseReaderDecorator extends ReaderDecorator{
    public async read(){
        const data =  await this.fileReader.read()
        return data.toLowerCase()
    }
}

class RemoveSpacesReaderDecorator extends ReaderDecorator{
    public async read(){
        const data =  await this.fileReader.read()
        return data.split(" ").join("")
    }
}

class ToUpperCaseReaderDecorator extends ReaderDecorator{
    public async read(){
        const data =  await this.fileReader.read()
        return data.toUpperCase()
    }
}

class CharactersCountCaseReaderDecorator extends ReaderDecorator{
    public async read(){
        return this.fileReader.read()
    }

    public async getCharactersCount(){
        return (await this.read()).length
    }
}

class ReadDataPresenter {
    constructor(private reader:Reader) {
    }

    public present() {
        this.reader.read().then(console.log)
    }
}

class Main{
    public start(){
        let apiReader:any = new ApiReader("url")
        apiReader = new ToLowerCaseReaderDecorator(apiReader)
        apiReader = new RemoveSpacesReaderDecorator(apiReader)
        new ReadDataPresenter(apiReader).present()

        let fileReader:any = new FileReader("./patterns/decorator/test.txt")
        fileReader = new ToUpperCaseReaderDecorator(fileReader)
        fileReader = new RemoveSpacesReaderDecorator(fileReader)
        fileReader = new CharactersCountCaseReaderDecorator(fileReader)
        new ReadDataPresenter(fileReader).present()
        fileReader.getCharactersCount().then(console.log)
    }
}
new Main().start()
