### Pokemon Application - Inlämningsuppgift

#### Del 1 - Pokedex

-Skapa en dropdown-lista med samtliga dina Pokemon. Användaren ska kunna välja en Pokemon för att hämta dess data.
-Skapa en klass för varje Pokemon som har följande värden:
-Namn.
-Bild på en Pokemon.
-Vilken/Vilka typer din pokemon har (dvs “types” i API:et)
-Vikt
-Längd
-Samtliga 6 av dess stats - HP (Hit points), Attack, Special Attack, Defense, Special Defense, Speed.
-Metod för att jämföra två Pokemon med varandra.
Visa ut den valda Pokemonen med alla dess tillhörande värden.

#### Del 2 - Jämför Pokemon

-Gör det möjligt för användaren att välja ytterligare en Pokemon. Skriv ut alla dess värden.
-Användare ska kunna jämföra två Pokemon med varandra.
-Markera med färg vilken Pokemon som har högst värde vid jämförelse - jämför vikt, längd samt alla dess stats. Skriv ut i DOM:en vilken Pokemon som vinner i flest kategorier.

#### Del 3 - Pokemon Battle (VG)

- Implementerade möjligheten för två valda Pokemon att strida mot varandra.
- Turades om att attackera tills en av deras HP når 0.
- Började striden med den Pokemon med högst speed.
- Beräknade skadan och uppdaterade HP för respektive Pokemon efter varje attack.
  -Bägge Pokemon turas om att attackera varandra, tills en av deras HP (Hit points) når 0.
  Namnet på en Pokemon attack är den första i dess “moves”-lista.
  Damage calculation formula:
  Attackerande Pokemon (röd) - Försvarande Pokemon (blå)
  (Attack+Special Attack) - (Defense+Special defense) \* 0.8 = Skada
  Subtrahera den försvarande Pokemons HP med den gjorda skadan.
  Varje attack måste göra minst 10 i skada. T.ex om den beräknade skadan är 4, ändra det till 10.

- Skrev ut kampens förlopp i DOM:en.
