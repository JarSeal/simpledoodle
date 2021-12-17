export interface eventType {
    name: string,
    dates: [string],
    votes: [{
        date: string,
        people: [string],
    }],
}

export interface voteDataType {
    name: string,
    votes: [string],
}