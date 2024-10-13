import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'portfolio';

  items = [
    { title: 'Page 1', content: 'Content of Page 1' },
    { title: 'Page 2', content: 'Content of Page 2' },
    { title: 'Page 3', content: 'Content of Page 3' },
    { title: 'Page 1', content: 'Content of Page 1' },
    { title: 'Page 2', content: 'Content of Page 2' },
    { title: 'Page 3', content: 'Content of Page 3' },
  ];
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

// Detecta quando o toque começa
@HostListener('window:touchstart', ['$event'])
onTouchStart(event: TouchEvent) {
  this.touchStartY = event.touches[0].clientY;
}

// Detecta quando o toque termina e a direção do movimento
@HostListener('window:touchend', ['$event'])
onTouchEnd(event: TouchEvent) {
  const touchEndY = event.changedTouches[0].clientY;
  const deltaY = this.touchStartY - touchEndY;

  if (!this.isScrolling) {
    this.isScrolling = true;

    if (deltaY > 50) {
      // Deslizando para cima (scroll para baixo)
      this.nextDisplay();
    } else if (deltaY < -50) {
      // Deslizando para baixo (scroll para cima)
      this.prevDisplay();
    }

    // Define o timeout para resetar a flag após o tempo especificado
    setTimeout(() => {
      this.isScrolling = false;
    }, this.scrollDelay);
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
}
