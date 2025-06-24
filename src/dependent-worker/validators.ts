export const validateNumberOfHolders = (numberOfHolders?: number | null): void => {
    if (numberOfHolders !== null && numberOfHolders !== undefined && (numberOfHolders !== 1 && numberOfHolders !== 2)) {
        throw new Error("'numberOfHolders' must be null, undefined, 1 or 2");
    }
};

export const validateMarriedAndNumberOfHolders = (
    married: boolean,
    numberOfHolders?: number | null
): void => {
    if (married && (numberOfHolders === null || numberOfHolders === undefined)) {
        throw new Error("'numberOfHolders' is required for married workers");
    }
};

export const validateDependents = (
    numberOfDependents?: number | null,
    numberOfDependentsDisabled?: number | null
): void => {
    /**
     * Validate the number of dependents and the number of dependents disabled.
     */
    if (numberOfDependentsDisabled === null || numberOfDependentsDisabled === undefined) {
        return;
    }

    if (numberOfDependents === null || numberOfDependents === undefined) {
        throw new Error(
            "'numberOfDependents' is required when 'numberOfDependentsDisabled' is provided"
        );
    }

    if (numberOfDependentsDisabled > numberOfDependents) {
        throw new Error(
            "'numberOfDependentsDisabled' must be less than or equal to 'numberOfDependents'"
        );
    }
}; 