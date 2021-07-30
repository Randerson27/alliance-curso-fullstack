<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand>Movimentos</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-button v-on:click="$bvModal.show('modal-insert')">
          <b-icon-plus></b-icon-plus>
        </b-button>
      </b-navbar-nav>
    </b-navbar>
    <b-alert v-model="mostrarErro" variant="danger" dismissible>
      Falha ao {{errorMessage.action}} - {{errorMessage.message}}
    </b-alert>
   
  </div>
</template>

<script>
import Movimento from './Movimento.vue'
import FormMovimento from './FormMovimento.vue'
import axios from 'axios'
export default {
    name: 'ListaMovimentos',
    data: function() {
        return {
            movimento: [],
            newMovimento: {
              id: '',
              data_mov: '',
              categoria: '',
              descricao: '',
              valor: ''
            },
            mostrarErro: false,
            errorMessage: {
              action: '',
              message: ''
            }
        }
    },
    components: {
        Movimento,
        FormMovimento
    },
    methods: {
      removerMovimento: async function(index, movimento) {
        // envie o comando de excluir para o backend
        await axios.delete(`http://localhost:3000/movimentos/${movimento.id}`)
        this.movimentos.splice(index, 1)
      },
      adicionarMovimento: async function(movimento) {
        try {
          console.log("Adicionair movimento")
          console.log(movimento)
          var result = await axios.post("http://localhost:3000/movimentos", movimento)
          this.movimento.push(result.data)
        } catch (error) {
          this.mostrarErro = true;
          this.errorMessage.action = "inserir"
          this.errorMessage.message = error.response.statusText
        }
        this.$refs.formAdicionar.reset();
      },
      editarMovimento: async function(movimento, index) {
        try {
          var result = await axios.put(`http://localhost:3000/movimentos/${this.movimento[index].id}`, movimento)
          this.movimento[index].id = result.data.id
          this.movimento[index].data_mov = result.data.data_mov
          this.movimento[index].descricao = result.data.descricao
          this.movimento[index].categoria = result.data.categoria
          this.movimento[index].valor = result.data.valor
        } catch (error) {
          this.mostrarErro = true;
          this.errorMessage.action = "atualizar"
          this.errorMessage.message = error.response.statusText
        }
      }
    },
    async created() {
      var response = await axios.get('http://localhost:3000/movimentos')
      this.movimentos = response.data
    }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px;
  display: inline-block;
}
.navbar {
  margin-bottom: 10px;
}
</style>