// File to load text parameters in the program
//This is here that the code will detect if we are on the french or english page

console.log("Language of Page:");
console.log(document.documentElement.lang);

var start_dept, start_grp, start_lvl, start_lang, start_reg, start_one, start_int,
    all_depts_var, all_lang_var, all_reg_var, headers;

if (document.documentElement.lang === "en") {

// load_data paramters
    start_dept = "All departments";
    start_grp = "EC";
    start_lvl = "03";
    start_lang = "Any language requirements";
    start_reg = "All work locations";
    start_one = "Multiple Positions";
    start_int = "Internally Advertised Processes";

    all_depts_var= "All departments";
    all_lang_var= "Any language requirements";
    all_reg_var= "All work locations";

//Load Table Parameters

    headers = ["Organization", "Group", "Level", "Language", "Region", "Number of Positions", "Internal Process",
        "Process Number", "Title", "Close Date", "Number of Applications"];
}else{

    // load_data paramters
    start_dept = "Tous les départements";
    start_grp = "EC";
    start_lvl = "03";
    start_lang = "Toutes les exigences";
    start_reg = "RCN";
    start_one = "Plusieurs postes";
    start_int = "Processus Interne";


    all_depts_var= "Tous les départements";
    all_lang_var= "Toutes les exigences";
    all_reg_var= "Toutes les régions";

//Load Table Parameters

    headers = ["Organisation", "Groupe", "Niveau", "Langue", "Région", "nombre de Postes", "Zone de sélection",
        "Numéro de processus", "Titre", "Date de fermeture","Nombre de candidatures"];

}



