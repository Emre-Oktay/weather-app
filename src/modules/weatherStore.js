export class WeatherStore {
    constructor() {
        this.locations = [];
        this.displayUnit = 'celsius';
    }

    addLocation(locationData) {
        const existingIndex = this.locations.findIndex((loc) => loc.address === locationData.address);
        if (existingIndex >= 0) {
            return false;
        }
        this.locations.push(locationData);
        return true;
    }

    removeLocation(address) {
        const index = this.locations.findIndex((loc) => loc.address === address);
        if (index >= 0) {
            this.locations.splice(index, 1);
            return true;
        }
        return false;
    }

    setDisplayUnit(unit) {
        this.displayUnit = unit;
    }

    getLocations() {
        return this.locations;
    }

    getDisplayUnit() {
        return this.displayUnit;
    }
}
