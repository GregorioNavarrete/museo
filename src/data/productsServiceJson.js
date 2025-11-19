const db = require('../model/database/models');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require("uuid");

/* ============================================================
   CONFIG PARA RENDER DISK
   Guarda JSON dentro del disco persistente:
   /var/data/json/
   ============================================================ */
const basePath = "/var/data"; 
const jsonPath = path.join(basePath, "json");
const imagesPath = path.join(basePath, "motos");

// Crear carpetas si no existen
if (!fs.existsSync(jsonPath)) {
    fs.mkdirSync(jsonPath, { recursive: true });
}
if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
}

// Archivos JSON
const fileName = path.join(jsonPath, "moto.json");
const fileName6 = path.join(jsonPath, "6motos.json");

// Si no existen, los crea inicializados
if (!fs.existsSync(fileName)) fs.writeFileSync(fileName, "[]");
if (!fs.existsSync(fileName6)) fs.writeFileSync(fileName6, "[]");

const productsServiceJson = {

    // ------------------------------------------------------------
    // LEER JSON PRINCIPAL
    // ------------------------------------------------------------
    getData: async function () {
        try {
            return JSON.parse(fs.readFileSync(fileName, "utf-8"));
        } catch (e) {
            console.error("Error leyendo moto.json:", e);
            return [];
        }
    },

    // ------------------------------------------------------------
    // LEER JSON DE 6 MOTOS DESTACADAS
    // ------------------------------------------------------------
    motos6: async function () {
        try {
            return JSON.parse(fs.readFileSync(fileName6, "utf-8"));
        } catch (e) {
            console.error("Error leyendo 6motos.json:", e);
            return [];
        }
    },

    // ------------------------------------------------------------
    // DEVOLVER TODO
    // ------------------------------------------------------------
    findAll: async function () {
        return this.getData();
    },

    // ------------------------------------------------------------
    // OBTENER SOLO CÓDIGOS
    // ------------------------------------------------------------
     findAllCodigosActivos: async function () {
        try {
            const data = await this.getData();
            if (!Array.isArray(data)) return [];

            return data
                .filter(item => {
                    // 1. Validamos que el objeto exista
                    if (!item) return false;

                    // 2. LÓGICA ACTIVO:
                    //    Se considera activa si es "true" (string o bool) 
                    //    O si es null / undefined (datos viejos sin el campo)
                    const valActivo = item.activo;
                    const estaActivo = String(valActivo) === "true" || valActivo === null || valActivo === undefined;

                    // (Alternativa rápida: si solo quieres excluir las borradas, podrías usar: String(item.activo) !== "false")

                    // 3. Validamos que tenga un código válido
                    const codigoValido = item.codigo && String(item.codigo).trim() !== "" && !/^null$/i.test(item.codigo);

                    return estaActivo && codigoValido;
                })
                .map(item => String(item.codigo).trim());

        } catch (e) {
            console.error("findAllCodigosActivos error:", e);
            return [];
        }
    },

    // ------------------------------------------------------------
    // OBTENER UNA MOTO POR ID
    // ------------------------------------------------------------
    getOne: async function (id) {
        try {
            const products = await this.findAll();
            return products.find(elem => elem.idUnico == id) || {};
        } catch (error) {
            console.log(error);
            return {};
        }
    },

    // ------------------------------------------------------------
    // CREAR UNA MOTO NUEVA
    // ------------------------------------------------------------
    create: async function (motoData) {
        let allUsers = await this.findAll();
        if (!Array.isArray(allUsers)) allUsers = [];

        // Nuevo ID autoincremental
        const maxId = allUsers.reduce((max, moto) => {
            const motoId = parseInt(moto.idUnico);
            return motoId > max ? motoId : max;
        }, 0);

        const newIdUnico = String(maxId + 1);

        // -------------------------------
        // GUARDAR IMAGEN CORRECTAMENTE
        // -------------------------------
        const imgPublicPath = motoData.file
            ? "/motos/" + motoData.file.filename
            : "";

        const newUser = {
            codigo: motoData.body.codigo || "",
            nombre: motoData.body.nombre || "",
            año: motoData.body.ano || "",
            origen: motoData.body.origen || "",
            cc: motoData.body.cc || "",
            HP: motoData.body.HP || "",
            Velocidades: motoData.body.Velocidades || "",
            arranque: motoData.body.arranque || "",
            marchas: motoData.body.marchas || "",
            rodado: motoData.body.rodado || "",
            motor: motoData.body.motor || "",
            carburador: motoData.body.carburador || "",
            color: motoData.body.color || "",
            frenos: motoData.body.frenos || "",
            embrague: motoData.body.embrague || "",
            datosAdjuntos: motoData.body.datosAdjuntos || "",
            observaciones: motoData.body.observaciones || "",

            idUnico: newIdUnico,
            activo: motoData.body.activo || "true",

            img: imgPublicPath,
            imagenes: motoData.body.imagenes || []
        };

        allUsers.push(newUser);

        fs.writeFileSync(fileName, JSON.stringify(allUsers, null, 2));

        return newUser;
    },

    // ------------------------------------------------------------
    // BORRAR (DESACTIVAR) UNA MOTO
    // ------------------------------------------------------------
    borrar: async function (idUnico) {
        try {
            let allMotos = await this.findAll();
            let motoIndex = allMotos.findIndex(moto => moto.idUnico == idUnico);

            if (motoIndex === -1) return false;

            allMotos[motoIndex].activo = "false";
            fs.writeFileSync(fileName, JSON.stringify(allMotos, null, 2));

            return allMotos[motoIndex];
        } catch (e) {
            console.error("Error en 'borrar':", e);
            return false;
        }
    },

    // ------------------------------------------------------------
    // EDITAR
    // ------------------------------------------------------------
    Editar: async function (idUnico, motoData) {
        try {
            let allMotos = await this.findAll();
            let motoIndex = allMotos.findIndex(moto => moto.idUnico == idUnico);

            if (motoIndex === -1) return false;

            const updatedMoto = {
                ...allMotos[motoIndex],
                ...motoData.body
            }; // ← COMA FINAL QUITADA

            // Si subieron nueva imagen
            if (motoData.file) {
                updatedMoto.img = "/motos/" + motoData.file.filename;
            }

            allMotos[motoIndex] = updatedMoto;

            fs.writeFileSync(fileName, JSON.stringify(allMotos, null, 2));

            return updatedMoto;

        } catch (e) {
            console.error("Error en 'Editar':", e);
            return false;
        }
    }
};

module.exports = productsServiceJson;
