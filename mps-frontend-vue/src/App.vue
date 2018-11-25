<template>
  <div id="app" class="App">
    <form>
      <div class="Map" :style="mapStyle()">
        <div class="info">
          <div class="lastUpdate">Updated on: {{state.lastUpdate}}</div>
          <div class="lastRides">Last 5 trips summary:
            <div v-for="ride in lastRides()" v-bind:key="ride">
              {{ride}}
            </div>
          </div>
        </div>

        <!-- Plotting cars -->
        <div v-for="car in state.cars" v-bind:key="car.carPlate" class="car"
          :style="carStyle(car)">
          <i class="fas fa-car-side fa-2x"></i>
          <div>
            {{car.carPlate}}
          </div>
        </div>

        <!-- Plotting customers -->
        <div v-for="customer in state.customers" v-bind:key="customer.name">
            <div class="customer" :style="customerStyle(customer)">
                <i class="fas fa-male fa-2x"></i>
                <div class="customerName">{{customer.name}}</div>
            </div>
            <div class="customer" :style="customerDestinationStyle(customer)">
                <i class="far fa-dot-circle"></i>
                <div>{{customer.name}} Destination</div>
            </div>
        </div>
      </div>
      <div class="Config">
        <div class="form">
            <label htmlFor="carsOnMap">Active Cars</label>
            <input type="number" id="carsOnMap" name="carsOnMap" v-model="config.carsOnMap" v-on:input="onConfigChange"/>
            <label htmlFor="customersOnMap">Active Customers</label>
            <input type="number" id="customersOnMap" name="customersOnMap" v-model="config.customersOnMap" v-on:input="onConfigChange"/>
            <label htmlFor="pricePerKM">Price per KM</label>
            <input type="number" id="pricePerKM" name="pricePerKM" v-model="config.pricePerKM" v-on:input="onConfigChange"/>
            <label htmlFor="speed">Speed</label>
            <input type="number" id="speed" name="speed" v-model="config.speed" v-on:input="onConfigChange"/>
        </div>

        <div class="buttons">
          <button v-on:click="stop">
              <i class="fas fa-stop"></i>
          </button>
          <button v-on:click="start">
              <i class="fas fa-play"></i>
          </button>
          <button v-on:click="pause">
              Pause
          </button>
          <button v-on:click="resume">
              Resume
          </button>
        </div>

      </div>
    </form>
  </div>
</template>

<script>

import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  sockets: {
      connect: function () {
        console.log('socket connected');
        this.$socket.emit('needConfig')
      },
      step: function (state) {
          this.state = state;
      },
      configChanged: function(config) {
        this.config = config;
      }
  },
  methods: {
      stop(e) {
        e.preventDefault();
        this.$socket.emit('stop');
      },
      start(e) {
        e.preventDefault();
        this.$socket.emit('start');
      },
      resume(e) {
        e.preventDefault();
        this.$socket.emit('resume');
      },
      pause(e) {
        e.preventDefault();
        this.$socket.emit('pause');
      },
      customerStyle(customer) {
        return `position: absolute; top: ${customer.location.y}px; left: ${customer.location.x}px`
      },
      customerDestinationStyle(customer) {
        return `position: absolute; top: ${customer.destination.y}px; left: ${customer.destination.x}px`
      },
      carStyle(car) {
        const location = car.location
        return `position: absolute; top: ${location.y}px; left: ${location.x}px`
      },
      mapStyle() {
        const simState = this.state;

        if (simState && simState.currentArea) {
          const area = simState.currentArea;

          const minX = Math.min(area.startPoint.x, area.endPoint.x);
          const minY = Math.min(area.startPoint.y, area.endPoint.y);

          const maxX = Math.max(area.startPoint.x, area.endPoint.x);
          const maxY = Math.max(area.startPoint.y, area.endPoint.y);

          const width = (maxX - minX) + 50;
          const height = (maxY - minY) + 50;

          return `width: ${width}px; height: ${height}px`;
        }

        return '';
      },
      lastRides() {
        const trips = this.state.lastTrips;

        if (!trips) {
          return
        }

        const lastTrips = [];

        for (let i = trips.length - 5; i < trips.length; i++) {
            lastTrips.push(trips[i])
        }

        return lastTrips;
      },
      onConfigChange(e) {
        this.$socket.emit('updateConfig', this.config)
      }

  },
  data() {
    return {
      config: {
        carsOnMap: 0,
        customersOnMap: 0,
        pricePerKM: 0,
        speed: 0,
      },
      state: {
        cars: [],
        customers: []
      }
    }

  }
}
</script>

<style>

body {
    background-color: aliceblue;
    font-family: sans-serif;
}

.App {
    margin: auto;
}

.Config {
    width: 200px;
    position: absolute;
    border: 1px solid gray;
    bottom: 10px;
    right: 10px;
    padding: 10px;
    background-color: lightgreen;
}

.Config .buttons {
    margin: auto;
    text-align: center;
    margin-top: 10px;
}

.Config .form {
    display: grid;
    grid-template-columns: 70% 30%;
}

.Config .form label {
    padding-right: 10px;
    margin: 2px;
}

.Config .form input {
    width: 100%;
    margin: 2px;
}

.Map {
    margin: auto;
    background-color: lightblue;
    border: 1px solid black;
    min-width: 100px;
    min-height: 100px;
    position: relative;
}

.Map .customer {
    padding: 2px;
    height: 10px;
    font-size: xx-small;
    font-family: sans-serif;
    color: darkblue;
    text-align: center;
    width: 40px;
    height: 25px;
}

.Map .customer .customerName {
    padding-top: 10px;
}

.Map .car {
    padding: 2px;
    height: 10px;
    font-size: xx-small;
    font-family: sans-serif;
    color: darkgreen;
    text-align: center;
    width: 40px;
    height: 25px;
}

.Map .info {
    font-size: small;
}

</style>
