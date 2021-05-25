function init(boardSize, popSize, maxGen, crossRate, mutRate) {
    generations = [];
    generations.push(new Population(boardSize, popSize, crossRate, mutRate));
    generations[0].calAllFitness();
    populateTable(generations[0].DNAs);
}

//[CLASSES]

//Disclaimer : naming classes such as DNA,Genes, Population is for better understanding in learning GA

function DNA() {
    //[Description]

    //1 DNA has genes, and fitness score

    //Fitness score is a score to determine this DNA score, higher the score the better

    //Because of this is for N Queens Problem, 
    //and N queen problem will have exactly 1 queen in each column,
    //so i will make the structure of DNA consist of N Genes
    //Each gene has row position for the queen

    //[END Description]

    //[Constructor]

    //Gene(1 Queen Position)
    this.genes = [];

    //Fitness score(returns n queen alive)
    this.fitness = 0;

    //[END Constructor]

    //Fill genes with random position(called by Population on first initialization)
    this.fillRandomGenes = function(boardSize) {
        for (let i = 0; i < boardSize; i++) {
            this.genes.push(Math.floor(Math.random() * boardSize));
        }
    }

    this.valueString = function() {
        return this.genes.join(' | ');
    }

    this.calculateFitness = function() {
        //In this particular project, the fitness calculated by how many queen is alive

        //Diagonal score for comparing
        let upRightDownLeft = [];
        let upLeftDownRight = [];
        //Status for each position : 1 if alive
        let statuses = Array(this.genes.length).fill(1);
        let score = this.genes.length;

        for (let i = 0; i < this.genes.length; i++) {
            upRightDownLeft.push(this.genes[i] + i);
            upLeftDownRight.push(Math.abs(this.genes[i] - i));

        }

        for (let i = 0; i < this.genes.length - 1; i++) {
            for (let j = i + 1; j < this.genes.length; j++) {
                if ((this.genes[i] == this.genes[j] || upRightDownLeft[i] == upRightDownLeft[j] || upLeftDownRight[i] == upLeftDownRight[j]) && (statuses[i] == 1 || statuses[j] == 1)) {
                    if (statuses[i] == 1) score -= 1;
                    if (statuses[j] == 1) score -= 1;
                    statuses[i] = 0;
                    statuses[j] = 0;
                }
            }
        }

        //Fitness score will be power by 2 so the higher fitness would more likely to be picked
        this.fitness = score;
        return this.fitness *= this.fitness;
    }

    //Crossover function to produce 1 child from 2 DNA
    this.crossover = function(partnerDNA, crossRate) {
        let child = new DNA();
        for (let i = 0; i < this.genes.length; i++) {
            let randNum = Math.floor(Math.random() * 10);
            if (randNum <= crossRate) child.genes.push(partnerDNA.genes[i]);
            else child.genes.push(this.genes[i]);
        }
        console.log(child);
        return child;
    }

}

function Population(boardSize, popSize, crossRate, mutRate) {

    this.size = popSize;
    this.crossoverRate = crossRate;
    this.mutationRate = mutRate;

    this.DNAs = [];

    for (let i = 0; i < this.size; i++) {
        this.DNAs.push(new DNA());
        this.DNAs[i].fillRandomGenes(boardSize);
    }

    this.calAllFitness = function() {
        for (let i = 0; i < this.size; i++) {
            this.DNAs[i].calculateFitness();
        }
    }

}

//[END CLASSES]