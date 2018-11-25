<template>
  <div id="app" class="App">
    <form>
      <div class="Map">
      </div>
      <div class="Config">
        <div class="form">
            <label htmlFor="carsOnMap">Active Cars</label>
            <input type="number" id="carsOnMap" name="carsOnMap" value={this.state.carsOnMap} onChange={this.onChange}/>
            <label htmlFor="customersOnMap">Active Customers</label>
            <input type="number" id="customersOnMap" name="customersOnMap" value={this.state.customersOnMap} onChange={this.onChange}/>
            <label htmlFor="pricePerKM">Price per KM</label>
            <input type="number" id="pricePerKM" name="pricePerKM" value={this.state.pricePerKM} onChange={this.onChange}/>
            <label htmlFor="speed">Speed</label>
            <input type="number" id="speed" name="speed" value={this.state.speed} onChange={this.onChange}/>
        </div>

        <div class="buttons">
          <button onClick="{ e => { e.preventDefault(); this.stop(); } }">
              <i class="fas fa-stop"></i>
          </button>
          <button onClick="{e => { e.preventDefault(); this.start(); }}">
              <i class="fas fa-play"></i>
          </button>
          <button onClick="{e => {e.preventDefault(); this.pause(); }}">
              Pause
          </button>
          <button onClick="{e => { e.preventDefault(); this.resume(); }}">
              Resume
          </button>
        </div>

      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

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
