// File to laod text parameters in the program
//This is here that the code will detect if we are on the french or english page

console.log(document.documentElement.lang)

if (document.documentElement.lang === "en") {
// load_data paramters
    var start_dept = "All departments";
    var start_grp = "EC";
    var start_lvl = "03";
    var start_lang = "Any language requirements";
    var start_reg = "All work locations";
    var start_one = "Multiple Positions";
    var start_int = "Internally Advertised Processes";

    var all_depts_var = "All departments";
    var all_lang_var = "Any language requirements";
    var all_reg_var = "All work locations";

//Load Table Parameters

    var headers = ["Organization", "Group", "Level", "Language", "Region", "Number of Positions", "Internal Process",
        "Process Number", "Title", "Close Date", "Number of Applications"];

}else{

    // load_data paramters
    var start_dept = "Tous les départements";
    var start_grp = "EC";
    var start_lvl = "03";
    var start_lang = "Toutes les exigences";
    var start_reg = "RCN";
    var start_one = "Plusieurs postes";
    var start_int = "Processus Interne";


    var all_depts_var = "Tous les départements";
    var all_lang_var = "Toutes les exigences";
    var all_reg_var = "Toutes les régions";

//Load Table Parameters

    var headers = ["Organisation", "Groupe", "Niveau", "Langue", "Région", "nombre de Postes", "Zone de sélection",
        "Numéro de processus", "Titre", "Date de fermeture","Nombre de candidatures"];

}