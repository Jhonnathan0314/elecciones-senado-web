export class Party {
    id: number = 0;
    name: string = '';
    motto: string = '';
    logo: string = '';
}

export class Candidate {
    id?: number = 0;
    cardNumber: number = 0;
    resolutionNumber: string = '';
    name: string = '';
    lastName: string = '';
    party: Party = new Party();
}

export class ElectionTable {
    id: number = 0;
    numberIds: number = 0;
    totalVotes: number = 0;
}

export class Result {
    id: number = 0;
    votes: number = 0;
    electionTable: ElectionTable = new ElectionTable();
    candidate: Candidate = new Candidate();
}