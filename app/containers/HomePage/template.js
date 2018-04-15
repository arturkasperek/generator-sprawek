export default function (items) {
  return `
\\documentclass[12pt,a4paper]{article}
\\usepackage[polish]{babel}
\\usepackage[T1]{fontenc}
\\usepackage[utf8x]{inputenc}
\\usepackage{graphicx}
\\usepackage{adjustbox}
\\usepackage{spverbatim}


\\addtolength{\\hoffset}{-1.5cm}
\\addtolength{\\marginparwidth}{-1.5cm}
\\addtolength{\\textwidth}{3cm}
\\addtolength{\\voffset}{-1cm}
\\addtolength{\\textheight}{2.5cm}
\\setlength{\\topmargin}{0cm}
\\setlength{\\headheight}{0cm}

\\begin{document}
	
	\\title{Sprawozdanie nr 1\\\\Systemy Sztucznej Inteligencji}
	\\author{autor1, grupa Y}
	\\date{\\today}
	
	\\maketitle
	\\begin{itemize}
	  ${items.map((item, idx) => `
      \\item Zad${idx} ${item.name}
        \\begin{spverbatim}
${item.code}
        \\end{spverbatim}
          \\adjustbox{valign=t}{%
                  \\includegraphics[width=1\\linewidth]{zad${idx}.png}%
              }
	  `)}
	\\end{itemize}
\\end{document}

  `;
}
