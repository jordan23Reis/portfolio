import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Platform } from '@angular/cdk/platform';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
   
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'portfolio';
  platform = inject(Platform);
  isMobile = this.platform.ANDROID || this.platform.IOS;

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

  currentDisplay: number = 1;
  isScrolling: boolean = false;
  scrollDelay: number = 1500;
  touchStartY: number = 0;

  @HostListener('window:wheel', ['$event'])
  onScroll(event: WheelEvent) {
    if (!this.isScrolling) {
      this.isScrolling = true;

      if (event.deltaY > 0) {
        this.nextDisplay();
      } else {
        this.prevDisplay();
      }
      setTimeout(() => {
        this.isScrolling = false;
      }, this.scrollDelay);
    }
  }

  touchStartX: number = 0;

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('window:touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const deltaX = this.touchStartX - touchEndX;
    const deltaY = this.touchStartY - touchEndY;

    if (!this.isScrolling) {
      this.isScrolling = true;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
          this.nextDisplay();
        } else if (deltaX < -50) {
          this.prevDisplay();
        }
      } else {
        if (deltaY > 50) {
          this.nextDisplay();
        } else if (deltaY < -50) {
          this.prevDisplay();
        }
      }
      setTimeout(() => {
        this.isScrolling = false;
      }, this.scrollDelay);
    }
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (window.scrollY === 0 && event.touches[0].clientY > this.touchStartY) {
      event.preventDefault();
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
    this.currentDisplay = displayNumber;
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
      setTimeout(() => this.type(), 100);
    }
  }

  triggerLink(linkId: string) {
    const link = document.getElementById(linkId) as HTMLAnchorElement;
    link.click();
  }

  items = [
    {
      src: 'assets/a (1).jpg',
      alt: 'Hidden Item 1',
      position: 'hidden',
    },
    {
      src: 'assets/a (2).jpg',
      alt: 'Hidden Item 2',
      position: 'hidden',
    },
    { src: 'assets/a (3).jpg', alt: 'Left Item', position: 'left' },
    { src: 'assets/a (4).jpg', alt: 'Center Item', position: 'center' },
    { src: 'assets/a (5).jpg', alt: 'Right Item', position: 'right' },
  ];

  rotateRight() {
    const lastItem = this.items.pop();
    if (lastItem) {
      this.items.unshift(lastItem);
      this.updatePositions();
    }
  }

  rotateLeft() {
    const firstItem = this.items.shift();
    if (firstItem) {
      this.items.push(firstItem);
      this.updatePositions();
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
      this.rotateRight();
    } else if (position === 'right') {
      this.rotateLeft();
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
