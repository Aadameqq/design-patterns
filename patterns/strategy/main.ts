
interface Weapon {
    use(userName:string):void
}

class Player {
    private static playerName = "Player"

    constructor(private weapon:Weapon){
    }

    setWeapon = (weapon:Weapon) => {
        this.weapon = weapon
    }

    fight = () =>{
        this.weapon.use(Player.playerName)
        this.weapon.use(Player.playerName)
    }
}

class SwordWeapon implements Weapon{
    private static damage = 27

    use(userName:string): void {
        console.log(`${userName} used his sword and dealt a blow to his opponent. The opponent lost ${SwordWeapon.damage} hp`)
    }

}

class RifleWeapon implements Weapon{
    private static damage = 62

    use(userName:string): void {
        console.log(`${userName} used his rifle and shot opponent. The opponent lost ${RifleWeapon.damage} hp`)
    }

}

class Game{
    run(){
        const sword = new SwordWeapon
        const rifle = new RifleWeapon

        const player = new Player(sword)

        player.fight()
        player.setWeapon(rifle)
        player.fight()
    }
}

new Game().run()

