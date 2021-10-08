const csvForm = document.getElementById('csvForm') as HTMLFormElement;
const csvFile = document.getElementById('csvFile') as HTMLInputElement;
const displayArea = document.getElementById('displayArea') as HTMLDivElement;


// is the array to hold the final values from the CSV file
let final_vals = [];

// Create an event listener for the form object
csvForm.addEventListener("submit", (e: Event) =>  {
    e.preventDefault(); // prevent HTML form submission


    let csvReader = new FileReader(); // generate a filereader from the JS API

    const input = csvFile.files[0]; // grab the first (only) file from the input 

    

    // generating the function that will run on the action
    csvReader.onload = function(evt) {
        const text = evt.target.result; // this is the data generated from the csvReader reading the information in the file

        // Ensure the type of information from the file is a string
        if(typeof text === 'string' || text instanceof String) {

            const values = text.split(/[\n]+/); // group the information by the CSV breakpoint \n is a new line
            
            values.forEach(val => {
                // further split by each section by the CSV
                final_vals.push(val.split(',')); 
            });

            // create form 
            generate_table(<[string[]]>final_vals)
                    .then(result => {
                    // async function is used to ensure the formatting does not try to occur after the table is created

                    displayArea.innerHTML = result;

                    const th_values = document.getElementsByTagName('th');
                    const td_values = document.getElementsByTagName('td');

                    const capitilize_table_column = (table_el: HTMLElement) => {
                        table_el.innerHTML = table_el.innerHTML[0].toUpperCase() + table_el.innerHTML.slice(1);
                    }

                    for (const th_val of th_values) {
                        capitilize_table_column(th_val);
                    }
                    for (const td_val of td_values) {
                        capitilize_table_column(td_val);
                    }
                });
        }
    }

    // this runs the above action   
    csvReader.readAsText(input);

    
});


// used as async to ensure a promise can be used to format the data
const generate_table = async (arrayTable: [string[]]) : Promise<string> => {
    return `
        <table class="table table-striped">
            <thead>
                ${arrayTable[0].map(val => {
                    return `
                        <th scope="col">${val}</th>
                    `
                }).join('')}
            </thead>
            <tbody>
            ${arrayTable.map((val, index) => {
                if(index === 0) return;
                return `
                    <tr>
                        ${val.map(sub_val => {
                            return `
                                <td>${sub_val}</td>
                            `
                        }).join('')}
                    </tr>
                `
            }).join('')}

            </tbody>
        </table>
    `;
}