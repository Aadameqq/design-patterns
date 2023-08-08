class KeyboardBindings {

    private bindings:{[key:string]:Command | undefined} = {};
    private history:Command[] = [];

    public setBind(button:string, command:Command){
        this.bindings[button] = command;
    }

    public pressButton(button:string){
        const command = this.bindings[button];
        if(!command) return;
        this.history.push(command);
        command.execute();
    }

    public undo(commandsCount:number){
        const maxUndoable = Math.min(commandsCount,this.history.length)
        for(let i = 0; i<maxUndoable;i++){
            const command = this.history.pop();
            command?.undo();
        }
    }
}

interface Command{
    execute:()=>void;
    undo:()=>void
}

class PlayerTurnLeftCommand implements Command{
    public execute(): void {
        console.log("Executing: player turn left")
    }

    public undo(): void {
        console.log("Undoing: player turn left")
    }
}

class PlayerJumpCommand implements Command{
    public execute(): void {
        console.log("Executing: player jump")
    }

    public undo(): void {
        console.log("Undoing: player jump")
    }
}



const keyboardBindings = new KeyboardBindings();

keyboardBindings.setBind("left_arrow",new PlayerTurnLeftCommand())
keyboardBindings.setBind("space",new PlayerJumpCommand())
keyboardBindings.pressButton("left_arrow")
keyboardBindings.pressButton("left_arrow")
keyboardBindings.pressButton("space")
keyboardBindings.pressButton("left_arrow")
keyboardBindings.undo(3);
keyboardBindings.pressButton("some_key_that_does_not_exist")

