function init(boardSize, popSize, maxGen, crossRate, mutRate) {
    let population = new Population(boardSize, popSize, crossRate, mutRate, true);
    console.log(population.DNAs.length);
    let timer = setInterval(function() {
        population.calAllFitness();
        if (population.isFinished() || population.generationCount == maxGen) {
            populateTable(population.DNAs);
            clearInterval(timer);
        } else {
            population.NaturalSelection();
            console.log('Mating Pool :');
            console.log(population.matingPool);
            console.log('Old DNAs');
            console.log(population.DNAs);
            population.Generate();
            console.log('New DNAs');
            console.log(population.DNAs);
            console.log('DNA Size : ' + population.DNAs.length);
            console.log('Generation : ' + population.generationCount);
        }
        $("#currentGen").text(population.generationCount);
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
    var self = this;
    self.genes = [];

    //probability score of will it be likely choose
    self.prob = 0;

    //Fitness score(returns n queen alive)
    self.fitness = 0;

    //[END Constructor]

    //Fill genes with random position(called by Population on first initialization)
    self.fillRandomGenes = function(boardSize) {
        function shuffle(array) {
            array.sort(() => Math.random() - 0.5);
        }

        let newGenes = [];
        for (let i = 0; i < boardSize; i++) {
            newGenes.push(i);
        }
        shuffle(newGenes);
        self.genes = newGenes;
    }

    //for displaying position : 0|1|2|3|4|5|6|...
    self.valueString = function() {
        return self.genes.join(' | ');
    }

    //calculate prob to be selected
    self.calculateProb = function(fitnessSum) {
        return self.prob = self.fitness / fitnessSum;
    }

    self.calculateFitness = function() {
        //In this particular project, the fitness calculated by how many queen is alive

        //Diagonal score for comparing
        let upRightDownLeft = [];
        let upLeftDownRight = [];
        //Status for each position : 1 if alive
        let statuses = Array(self.genes.length).fill(1);
        console.log(statuses);
        let score = self.genes.length;

        for (let i = 0; i < self.genes.length; i++) {
            console.log(i, (self.genes[i] + i), Math.abs(self.genes[i] - i));
            upRightDownLeft.push(self.genes[i] + i);
            upLeftDownRight.push(self.genes[i] - i);
        }

        for (let i = 0; i < self.genes.length - 1; i++) {
            for (let j = i + 1; j < self.genes.length; j++) {
                if ((self.genes[i] == self.genes[j] || upRightDownLeft[i] == upRightDownLeft[j] || upLeftDownRight[i] == upLeftDownRight[j])) {
                    statuses[i] = 0;
                    statuses[j] = 0;
                    console.log('index ' + i);
                    console.log(self.genes[i] == self.genes[j], upRightDownLeft[i] == upRightDownLeft[j], upLeftDownRight[i] == upLeftDownRight[j]);
                    console.log(upLeftDownRight);
                }
            }
        }
        console.log(statuses);
        for (let i = 0; i < statuses.length; i++) {
            if (statuses[i] == 0) score--;
        }

        //Fitness score will be multiply by itself(power by 2) so the higher fitness would more likely to be picked
        self.fitness = score * score;
    }

    //Crossover function to produce 1 child from 2 DNA
    self.crossover = function(partnerDNA, crossRate) {
        let child = new DNA();
        for (let i = 0; i < self.genes.length; i++) {
            let randNum = Math.random();
            if (randNum >= crossRate) child.genes.push(partnerDNA.genes[i]); // Gene from parent B
            else child.genes.push(self.genes[i]); // Gene from parent A
        };
        return child;
    }

    self.mutate = function(mutationRate) {
        let rand = Math.random();
        if (rand < mutationRate) {
            let index1 = Math.floor(Math.random() * self.genes.length);
            let index2 = Math.floor(Math.random() * self.genes.length);
            while (index2 == index1) index2 = Math.floor(Math.random() * self.genes.length);
            let temp = self.genes[index1];
            self.genes[index1] = self.genes[index2];
            self.genes[index2] = temp;
        }
    }

}

function Population(boardSize, popSize, crossRate, mutRate, firstGeneration = false, generationCount = 1) {
    //[Description]

    //Population consist of multiple DNAs

    //Population will be use to track each DNA for generations

    //In Population, DNAs will be measured, and selected for creating new DNA for
    //newer and hopefully better generation

    //[END Description]

    //[Constructor]
    var self = this;

    self.boardSize = boardSize;
    self.populationSize = popSize;
    self.crossoverRate = crossRate;
    self.mutationRate = mutRate;
    self.generationCount = generationCount;
    self.firstGeneration = firstGeneration;

    self.fitnessSum = 0;
    self.matingPool = [];
    self.finished = false;
    //Perfect score will be all queens squared
    self.perfectScore = boardSize * boardSize;

    self.DNAs = [];

    for (let i = 0; i < self.populationSize; i++) {
        if (self.firstGeneration) {
            self.DNAs.push(new DNA());
            self.DNAs[i].fillRandomGenes(boardSize);
        }
    }

    //[END Constructor]

    //Function for sorting DNAs by fitness
    function compare(a, b) {
        if (a.fitness > b.fitness) {
            return -1;
        }
        if (a.fitness < b.fitness) {
            return 1;
        }
        return 0;
    }

    //Calculate all fitness inside each DNA
    // so it can be choose if its a good DNA or not
    //and then add their fitness to fitnessSum to measure probability
    //for it to be added to the mating pool
    self.calAllFitness = function() {
        self.fitnessSum = 0;
        for (let i = 0; i < self.populationSize; i++) {
            self.DNAs[i].calculateFitness();
            self.fitnessSum += self.DNAs[i].fitness;
        }

        for (let i = 0; i < self.populationSize; i++) {
            self.DNAs[i].calculateProb(self.fitnessSum);
        }
        self.DNAs.sort(compare);
        self.getBest();
    }

    //Natural Selection is a function to select multiple DNA within this population
    //and put them to mating pool and then 2 of each random DNA from that mating pool
    //will be used to create a new DNA
    //Accept Reject is good but this is better and it was found i think in mid 2020
    self.NaturalSelection = function() {
        self.matingPool = [];
        for (let i = 0; i < self.populationSize; i++) {
            let rand = Math.random();
            for (let j = 0; j < self.populationSize; j++) {
                rand = rand - self.DNAs[j].prob;
                if (rand < 0) {
                    rand = Math.random();
                    self.matingPool.push(self.DNAs[j]);
                }
            }
        }
    }

    //Create a new generation
    self.Generate = function() {
        console.log('Generate : ');
        for (let i = 0; i < self.populationSize; i++) {
            let randA = Math.floor(Math.random() * self.matingPool.length);
            let randB = Math.floor(Math.random() * self.matingPool.length);
            console.log(pickOne(Math.floor(Math.random() * self.matingPool.length)));
            let parentA = self.matingPool[randA];
            let parentB = self.matingPool[randB];

            let newChild1 = parentA.crossover(parentB, self.crossoverRate);
            let newChild2 = parentB.crossover(parentA, self.crossoverRate);

            //Mutate and calculate its fitness
            newChild1.mutate(self.mutationRate);
            newChild1.calculateFitness();
            newChild2.mutate(self.mutationRate);
            newChild2.calculateFitness();

            //Compare 2 childs with the worst DNAs(Smallest Fitness) and replace it if the newChild has higher fitness
            if (newChild1.fitness > self.DNAs[self.DNAs.length - 1].fitness) {
                self.DNAs[self.DNAs.length - 1] = newChild1;
                self.DNAs.sort(compare);
            }
            if (newChild2.fitness > self.DNAs[self.DNAs.length - 1].fitness) {
                self.DNAs[self.DNAs.length - 1] = newChild2;
                self.DNAs.sort(compare);
            }
        }
        console.log('Generate End ');
        self.generationCount++;
    }

    function pickOne(randIndex) {
        let index = randIndex;
        let rand = Math.random();
        while (rand > 0) {
            rand -= self.matingPool[index].prob;
            if (rand < 0) {
                return index;
            }
            index++;
            if (index == self.matingPool.length) index = 0;
        }
    }

    //Finding the best DNA within its population
    self.getBest = function() {
        let worldRecord = 0.0;
        let index = 0;
        for (let i = 0; i < self.populationSize; i++) {
            if (self.DNAs[i].fitness > worldRecord) {
                index = i;
                worldRecord = self.DNAs[i].fitness;
            }
        }

        if (worldRecord == self.perfectScore) self.finished = true;
        return self.DNAs[index];
    }

    self.isFinished = function() {
        return self.finished;
    }

}

//[END CLASSES]