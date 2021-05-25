function init(boardSize, popSize, maxGen, crossProb, mutProb) {
    generations = [];
    generations.push(new Population(boardSize, popSize));
    populateTable(generations[0].DNAs);
}

//[CLASSES]

//Disclaimer : naming classes such as DNA,Genes, Population is for better understanding in learning GA

function DNA(boardSize) {
    //[DNA Structure]

    //1 DNA has genes, and fitness score

    //Fitness score is a score to determine this DNA score, higher the score the better

    //Because of this is for N Queens Problem, 
    //and N queen problem will have exactly 1 queen in each column,
    //so i will make the structure of DNA consist of N Genes
    //Each gene has row position for the queen

    //[END DNA Structure]

    //[Constructor]

    //Gene(1 Queen Position)
    this.genes = [];

    //Fitness score(returns n queen alive)
    this.fitness = 0;

    for (let i = 0; i < boardSize; i++) {
        this.genes.push(Math.floor(Math.random() * boardSize));
    }

    this.valueString = function() {
        return this.genes.join(' | ');
    }

    //[END Constructor]

}

function Population(boardSize, popSize) {

    this.size = popSize;

    this.DNAs = [];

    for (let i = 0; i < this.size; i++) {
        this.DNAs.push(new DNA(boardSize));
    }

}

//[END CLASSES]