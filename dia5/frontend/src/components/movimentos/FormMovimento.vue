<template>
    <b-modal :id="idModal ? idModal : ('modal-confirm-edit-'+movimento.id)" :title="title" v-on:ok="ok" v-on:cancel="reset">
        <p v-if="errors.length">
            <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
            <ul>
            <li v-for="error, index in errors" v-bind:key="index">{{ error }}</li>
            </ul>
        </p>
        <b-form>
            <b-form-input 
            v-model="idInterno.id"
            type="number"
            hidden
            ></b-form-input>

            <b-form-group
            id="input-nome"
            label="Nome"
            label-for="nome"
            description=""
            ></b-form-group>

            <b-form-input 
            id="nome"
            v-model="usuarioInterno.nome"
            type="text"
            required
            ></b-form-input>

            <b-form-group
            id="input-text"
            label="text"
            label-for="text"
            description="Descricao do produto"
            ></b-form-group>

            <b-form-input 
            id="login"
            v-model="idInterno.login"
            type="text"
            required
            ></b-form-input>

            <b-form-group
            id="input-email"
            label="E-mail"
            label-for="email"
            description="E-mail do usuário"
            ></b-form-group>

            <b-form-input 
            id=""
            v-model="idInterno.email"
            type=""
            required
            ></b-form-input>
        </b-form>
    </b-modal>
</template>

<script>
export default {
    name: "FormMovimento",
    data: function() {
        return {
            errors: [],
            idInterno: {
                dat_mov: '',
                descricao: '',
                categoria: '',
                valor: ''
            }
        }
    },
    props: {
        title: String,
        idModal: String,
        movimento: {
            id: Number,
            data_mov: String,
            descricao: String,
            categoria: String,
            valor: Number
        }
    },
    methods: {
        checkForm: function () {
            this.errors = [];
            if (!this.usuarioInterno.nome)
                this.errors.push("Informe o nome do usuário");
        
            if (!this.usuarioInterno.login)
                this.errors.push("Informe o login do usuário");
            if (!this.usuarioInterno.email)
                this.errors.push("Informe o e-mail do usuário");
            else {
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!   re.test(this.usuarioInterno.email)) 
                    this.errors.push("Informe um e-mail válido");
            }
            console.log(this.errors)
            return this.errors.length == 0;
        },
        ok: function(event) {
            if (!this.checkForm())
                event.preventDefault();
            else
                this.$emit('confirmed', this.usuarioInterno);
        },
        reset: function() {
            this.usuarioInterno.codigo = this.usuario.codigo
            this.usuarioInterno.nome = this.usuario.nome
            this.usuarioInterno.login = this.usuario.login
            this.usuarioInterno.email = this.usuario.email
        }
    },
    mounted() {
        this.reset();
    }
}
</script>

<style>
</style>