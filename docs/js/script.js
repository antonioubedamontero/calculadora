// Ejecutamos el JS sólo cuando se ha cargado la ventana
document.onload=iniciar();

function iniciar(){
    //Contiene todo el código ejecutable de la página */
    
    let arrBotones = [
        "%","CE","C","←",
        "1/x","x²","√(x)","/",
        "7","8","9","*",
        "4","5","6","-",
        "1","2","3","+",
        "+/-","0",".","="
    ]

    let visor = document.getElementById("visor");   // Visor de la calculador
    let operaciones = [""];                         // Operaciones realizadas
    let buffer = [""];                              // Almacena el último número

    // Dibujamos los botones correspondientes y les asociamos listeners
    dibujarBotones(arrBotones);

    function dibujarBotones(arrBtn){
        let contenedor = document.getElementById("panel");
        let boton;

        for (let ind=0; ind<arrBtn.length; ind++){
            // Pintamos los botones
            boton = document.createElement("div");
            boton.innerHTML = arrBtn[ind]; 
            boton.classList = "col-2 m-2 btn btn-primary";
            boton.addEventListener("click", pulsarBoton);
            contenedor.appendChild(boton);
        }
    }

    function pulsarBoton(e){
        //Borramos el error del display si lo tuviéramos
        if (buffer.length == 1 &&
            buffer[0] == '¡Error!'){

            buffer[0] = '';    
        }

        //El evento se genera automáticamente
        let tecla = e.target.innerHTML;

        switch (tecla) {
            // Cifras
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            // Decimales
            case '.': 
                // Almacenamos el valor en el buffer numérico
                if (isNaN(buffer.join("")+tecla)){
                    alert("No es un valor numérico válido");
                }else{
                    buffer.push(tecla);    
                }                
                break;

            // Suma, resta, multiplicación y división
            case "+":
            case "-":
            case "*":
            case "/": 
                if (buffer.length > 1){
                   //Encolamos el número del buffer en las operaciones
                   operaciones.push(buffer.join(""));
                   buffer=[""];

                   //Encolamos la operación
                   operaciones.push(tecla);
                };                 
                break;
            
            // Operaciones unarias sobre el número
            case "%":
            case "1/x":    
            case "x²":
            case "√(x)":                                
                let bufAnt = buffer.join("");

                switch(tecla){
                    case "%":
                        buffer = ['', `porciento(${bufAnt})`];
                        break;
                    case "1/x":
                        buffer = ['', `1/${bufAnt}`];
                        break;
                    case "x²":
                        buffer = ['', `Math.pow(${bufAnt},2)`];
                        break;
                    case "√(x)":
                        buffer = ['', `Math.sqrt(${bufAnt})`];
                        break;            
                }     

                break;
            // Borra la última cifra del buffer (si sigue siendo un número)
            case "←":
                let subArray = buffer.slice(0,buffer.length-1);

                if (isNaN(subArray.join(""))){
                   alert("No es un valor numérico válido"); 
                }else{
                   buffer.pop(); 
                }
                break;

            // Borrar la última entrada    
            case "CE":
                buffer.pop();
                break;

            //  Borra todas las entradas de la calculadora   
            case "C":
                operaciones = [""];
                buffer = [""];
                break;

            // Cambia el signo del número guardado en el buffer
            case "+/-":
               if (buffer[0] == ""){
                   buffer[0]="-";
               }else{
                   buffer[0]="";
               }
               break;

            // Calcular    
            case "=":
                calcular();     
                break;
            default:

            // En cualquier otro caso: no hacer nada    
                break;
        }

        //Dibujamos el resultado en el visor
        pintarEnVisor();
    }

    function pintarEnVisor(){
        let salVisor = operaciones.join("") + buffer.join("");

        //* Interpretar porcentajes: porciento(num);
        salVisor = salVisor.replace(/porciento\(([0-9]+)\)/gi,"$1%");

        //* Interpretar raiz cuadrada: Math.sqrt(num);
        salVisor = salVisor.replace(/Math.sqrt\(([0-9]+)\)/gi,"√$1"); 
        
        //* Interpretar cuadrado: Math.pow(num,2);
        salVisor = salVisor.replace(/Math.pow\(([0-9]+),2\)/gi,"$1²");

        if (salVisor == ""){
            visor.value = "0";
        }else{
            visor.value = salVisor;
        }
    }

    function porciento(num){
        return num/100;
    }

    function calcular(){
        // Nota: En Javascript da error cuando tenemos ++ ó --
        let resulPrev = operaciones.join("")+buffer.join("");
        resulPrev = resulPrev.replace("--","+");
        resulPrev = resulPrev.replace("++","+");

        resultado = eval(resulPrev);

        operaciones = [""];

        //Comprobamos si el resultado da error
        if (isFinite(resultado)){
            console.log("Resultado sin evaluar"+operaciones.join("")+buffer.join(""));
            console.log("Evaluado es: "+resultado);

            if (resultado >= 0){
                buffer = ["", Math.abs(resultado)];
            }else{
                buffer = ["-",Math.abs(resultado)];
            }
        }else{
            buffer = ["¡Error!"];
        }
    }

}