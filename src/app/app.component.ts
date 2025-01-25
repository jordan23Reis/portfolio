import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FilterPipe } from './filter.pipe';
import { OrderByPositionPipe } from './order.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FilterPipe, OrderByPositionPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'portfolio';

  // items = [
  //   { title: 'Page 1', content: 'Content of Page 1' },
  //   { title: 'Page 2', content: 'Content of Page 2' },
  //   { title: 'Page 3', content: 'Content of Page 3' },
  //   { title: 'Page 1', content: 'Content of Page 1' },
  //   { title: 'Page 2', content: 'Content of Page 2' },
  //   { title: 'Page 3', content: 'Content of Page 3' },
  // ];
  currentIndex = 0;

  nextSlide() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  currentDisplay: number = 1; // Começa pelo display1
isScrolling: boolean = false; // Flag para controlar o debounce
scrollDelay: number = 1500; // Tempo de espera (1.5 segundos)
touchStartY: number = 0; // Posição Y do toque inicial

@HostListener('window:wheel', ['$event'])
onScroll(event: WheelEvent) {
  if (!this.isScrolling) {
    this.isScrolling = true;

    if (event.deltaY > 0) {
      // Rolando para baixo
      this.nextDisplay();
    } else {
      // Rolando para cima
      this.prevDisplay();
    }

    // Define o timeout para resetar a flag após o tempo especificado
    setTimeout(() => {
      this.isScrolling = false;
    }, this.scrollDelay);
  }
}

touchStartX: number = 0; // Posição X do toque inicial

// Detecta quando o toque começa
@HostListener('window:touchstart', ['$event'])
onTouchStart(event: TouchEvent) {
  this.touchStartX = event.touches[0].clientX; // Armazena a posição X inicial do toque
  this.touchStartY = event.touches[0].clientY; // Armazena a posição Y inicial do toque
}

// Detecta quando o toque termina e a direção do movimento
@HostListener('window:touchend', ['$event'])
onTouchEnd(event: TouchEvent) {
  const touchEndX = event.changedTouches[0].clientX; // Posição X do toque final
  const touchEndY = event.changedTouches[0].clientY; // Posição Y do toque final
  const deltaX = this.touchStartX - touchEndX; // Diferença no eixo X
  const deltaY = this.touchStartY - touchEndY; // Diferença no eixo Y

  if (!this.isScrolling) {
    this.isScrolling = true;

    // Determina se o movimento é principalmente horizontal ou vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Movimento horizontal
      if (deltaX > 50) {
        // Deslizando para a esquerda
        this.nextDisplay();
      } else if (deltaX < -50) {
        // Deslizando para a direita
        this.prevDisplay();
      }
    } else {
      // Movimento vertical
      if (deltaY > 50) {
        // Deslizando para cima (scroll para baixo)
        this.nextDisplay();
      } else if (deltaY < -50) {
        // Deslizando para baixo (scroll para cima)
        this.prevDisplay();
      }
    }

    // Define o timeout para resetar a flag após o tempo especificado
    setTimeout(() => {
      this.isScrolling = false;
    }, this.scrollDelay);
  }
}

@HostListener('window:touchmove', ['$event'])
onTouchMove(event: TouchEvent) {
  // Verifica se está no topo da página ou rolando
  if (window.scrollY === 0 && event.touches[0].clientY > this.touchStartY) {
    event.preventDefault(); // Impede o comportamento padrão do navegador (reload)
  }
}

nextDisplay() {
  if (this.currentDisplay < 4) {
    this.currentDisplay++;
  } 
}

prevDisplay() {
  if (this.currentDisplay > 1) {
    if (this.currentDisplay === 4) {
      this.currentDisplay = 5;
      setTimeout(() => {
        this.currentDisplay = 3;
      }, 1500);
    } else {
      this.currentDisplay--;
    } 
  } 
}

goToDisplay(displayNumber: number) {
  this.currentDisplay = displayNumber; // Altera para o display correspondente
}

  text = '<Jordan Borges/>';
  displayedText = '';
  index = 0;

  ngOnInit() {
    this.type();
    this.sortItems();
  }

  type() {
    if (this.index < this.text.length) {
      this.displayedText += this.text.charAt(this.index);
      this.index++;
      setTimeout(() => this.type(), 100); // Ajuste a velocidade da digitação
    }
  }

  triggerLink(linkId: string) {
    const link = document.getElementById(linkId) as HTMLAnchorElement;
    link.click();
  }


  items = [    
    { src: 'assets/hidden-item1.jpg', alt: 'Hidden Item 1', position: 'hidden' },
    { src: 'assets/hidden-item2.jpg', alt: 'Hidden Item 2', position: 'hidden' },
    { src: 'assets/left-item.jpg', alt: 'Left Item', position: 'left' },
    { src: 'assets/center-item.jpg', alt: 'Center Item', position: 'center' },
    { src: 'assets/right-item.jpg', alt: 'Right Item', position: 'right' },
  ];
  
  rotateRight() {
    const lastItem = this.items.pop(); // Remove o último item
    if (lastItem) {
      this.items.unshift(lastItem); // Adiciona o item ao início do array
      this.updatePositions(); // Atualiza as posições
    }
  }
  
  rotateLeft() {
    const firstItem = this.items.shift(); // Remove o primeiro item
    if (firstItem) {
      this.items.push(firstItem); // Adiciona o item ao final do array
      this.updatePositions(); // Atualiza as posições
    }
  }
  
  updatePositions() {
    this.items.forEach((item, index) => {
      if (index === 0) {
        item.position = 'left';
      } else if (index === 1) {
        item.position = 'center';
      } else if (index === 2) {
        item.position = 'right';
      } else {
        item.position = 'hidden';
      }
    });
  }

  handleClick(position: string) {
    if (position === 'left') {
      this.rotateRight(); // Gira os itens para a direita
    } else if (position === 'right') {
      this.rotateLeft(); // Gira os itens para a esquerda
    }
  }

  sortItems() {
    const priorityOrder = ['left', 'center', 'right', 'hidden'];
    this.items.sort((a, b) => {
      return (
        priorityOrder.indexOf(a.position) - priorityOrder.indexOf(b.position)
      );
    });
  }
  
}


