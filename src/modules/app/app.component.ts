import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {AppConfigService} from "./config/app-config.service";
import {ActiveFeatureSet} from "./config/active-feature-set";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private titleService: Title,
    private configService: AppConfigService,
    private activeFeatureSet: ActiveFeatureSet,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const appTitle = this.titleService.getTitle();
    this.router
      .events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          const child = this.activatedRoute.firstChild;
          if (child?.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      ).subscribe((title: string) => {
      this.titleService.setTitle(title);
    });

    let themeClass = 'theme-sovity';
    if (this.activeFeatureSet.isMds()) {
      themeClass = 'theme-mds';
    }
    window.document.body.classList.add(themeClass)
  }
}
