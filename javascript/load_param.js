// File to load text parameters in the program
//This is here that the code will detect if we are on the french or english page

console.log("Language of Page:");
console.log(document.documentElement.lang);
var format = d3.format("d");

var start_dept, start_grp, start_lvl, start_lang, start_reg, start_one, start_aos, start_aca, all_aca_var, start_ee,
    all_depts_var, all_lang_var, all_reg_var, all_aos_var, headers, NCR_Multi_reg;

if (document.documentElement.lang === "en") {

// load_data paramters
    start_dept = "All departments";
    start_grp = "EC";
    start_lvl = "03";
    start_lang = "Any language requirements";
    start_reg = "All work locations";
    start_one = "One Position";
    start_aos = "ANY";
    start_aca = "ANY";
    start_ee = "No";

    all_depts_var= "All departments";
    all_lang_var= "Any language requirements";
    all_reg_var= "All work locations";
    all_aca_var= "ANY";
    all_aos_var= "ANY";

    NCR_Multi_reg = ["National Capital Region", "Multiple locations"]


//Load Table Parameters

    headers = ["Organization", "Language", "Work Location","Number of Positions", "Area of Selection", "Classification",
            "Education", "Process Number", "Title", "Close Date", "Number of Applications"];

}else{

    // load_data parameters
    start_dept = "Tous les départements";
    start_grp = "EC";
    start_lvl = "03";
    start_lang = "Toutes les exigences";
    start_reg = "Toutes les régions";
    start_one = "Un poste";
    start_aos = "Tous les types de processus";
    start_aca = "Tous les niveaux d'éducation";
    start_ee = "Non";

    all_depts_var= "Tous les départements";
    all_lang_var= "Toutes les exigences";
    all_reg_var= "Toutes les régions";
    all_aca_var= "Tous les niveaux d'éducation";
    all_aos_var= "Tous les types de processus";

    NCR_Multi_reg = ["Plusieurs régions", "Région de la capitale nationale"]

//Load Table Parameters

    headers = ["Organisation", "Langue",  "Région", "nombre de Postes", "Zone de sélection", "Classification",
        "Education", "Numéro de processus", "Titre", "Date de fermeture","Nombre de candidatures"];

}



