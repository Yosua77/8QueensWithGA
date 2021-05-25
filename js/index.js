function init(boardSize, popSize, maxGen, crossRate, mutRate) {
    generations = [];
    generations.push(new Population(boardSize, popSize, crossRate, mutRate, true));
    let timer = setInterval(function() {
        generations[generations.length - 1].calAllFitness();
        generations[generations.length - 1].NaturalSelection();
        let newGeneration = generations[generations.length - 1].Generate();
        let isFinished = generations[generations.length - 1].isFinished();
        if (isFinished || generations.length == maxGen) {
            populateTable(generations[generations.length - 1].DNAs);
            clearInterval(timer);
        } else generations.push(newGeneration);
        $("#currentGen").text(generations.length);
    }, 100);

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

    //probability score of will it be likely choose
    this.prob = 0;

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

    this.calculateProb = function(fitnessSum) {
        return this.prob = this.fitness / fitnessSum;
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

        //Fitness score will be multiply by 2 so the higher fitness would more likely to be picked
        this.fitness = score;
        return this.fitness += this.fitness;
    }

    //Crossover function to produce 1 child from 2 DNA
    this.crossover = function(partnerDNA, crossRate) {
        let child = new DNA();
        for (let i = 0; i < this.genes.length; i++) {
            let randNum = Math.floor(Math.random() * 10);
            if (randNum <= crossRate) child.genes.push(partnerDNA.genes[i]);
            else child.genes.push(this.genes[i]);
        };
        return child;
    }

    this.mutate = function(mutationRate) {
        for (let i = 0; i < this.genes.length; i++) {
            let rand = Math.random();
            if (rand < mutationRate) {
                this.genes[i] = Math.floor(Math.random() * this.genes.length);
            }
        }
    }

}

function Population(boardSize, popSize, crossRate, mutRate, firstGeneration = false) {
    //[Description]

    //Population consist of multiple DNAs

    //Population will be use to track each DNA for generations

    //In Population, DNAs will be measured, and selected for creating new DNA for
    //newer and hopefully better generation

    //[END Description]

    //[Constructor]

    this.boardSize = boardSize;
    this.populationSize = popSize;
    this.crossoverRate = crossRate;
    this.mutationRate = mutRate;

    this.fitnessSum = 0;
    this.matingPool = [];
    this.finished = false;
    this.perfectScore = boardSize * 2;

    this.DNAs = [];

    for (let i = 0; i < this.populationSize; i++) {
        this.DNAs.push(new DNA());
        if (firstGeneration) this.DNAs[i].fillRandomGenes(boardSize);
    }

    //[END Constructor]

    //Calculate all fitness inside each DNA
    // so it can be choose if its a good DNA or not
    //and then add their fitness to fitnessSum to measure probability
    //for it to be added to the mating pool
    this.calAllFitness = function() {
        for (let i = 0; i < this.populationSize; i++) {
            this.DNAs[i].calculateFitness();
            this.fitnessSum += this.DNAs[i].fitness;
        }

        for (let i = 0; i < this.populationSize; i++) {
            this.DNAs[i].calculateProb(this.fitnessSum);
        }
        this.getBest();
    }

    //Natural Selection is a function to select multiple DNA within this population
    //and put them to mating pool and then 2 of each random DNA from that mating pool
    //will be used to create a new DNA
    this.NaturalSelection = function() {
        this.matingPool = [];
        for (let i = 0; i < this.populationSize; i++) {

            let index = 0;
            let rand = Math.random();

            while (rand > 0) {
                rand -= this.DNAs[index].prob;
                index++;
            }
            index--;
            let chosenDNA = this.DNAs[index];
            this.matingPool.push(chosenDNA);
        }
    }

    //Create a new generation
    this.Generate = function() {
        let newPopulation = new Population(this.boardSize, this.populationSize, this.crossoverRate, this.mutationRate);
        for (let i = 0; i < this.populationSize; i++) {
            let randA = Math.floor(Math.random() * this.matingPool.length);
            let randB = Math.floor(Math.random() * this.matingPool.length);
            let parentA = this.matingPool[randA];
            let parentB = this.matingPool[randB];

            let newChild = parentA.crossover(parentB, this.crossoverRate);
            console.log(newChild);
            newChild.mutate(this.mutationRate);
            newPopulation.DNAs.push(newChild);
        }
        return newPopulation;
    }

    //Finding the best DNA within its population
    this.getBest = function() {
        let worldRecord = 0.0;
        let index = 0;
        for (let i = 0; i < this.populationSize; i++) {
            if (this.DNAs[i].fitness > worldRecord) {
                index = i;
                worldRecord = this.DNAs[i].fitness;
            }
        }

        if (worldRecord == this.perfectScore) finished = true;
    }

    this.isFinished = function() {
        return this.finished;
    }

}

//[END CLASSES]