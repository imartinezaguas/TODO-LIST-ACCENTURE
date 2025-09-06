import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FeatureFlagServiceService } from 'src/app/core/infrastructure/services/feature.service';
import { ENABLE_SEARCH_BAR, MESSAGE_SEARCH } from 'src/app/core/presentation/constants/const';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  imports: [IonicModule, CommonModule, FormsModule],
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Input() placeholder: string = MESSAGE_SEARCH;
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  searchBarEnabled: boolean = false;

  constructor(private featureFlag: FeatureFlagServiceService) {}

  async ngOnInit() {
    this.searchBarEnabled = await this.featureFlag.isFeatureEnabled(
      ENABLE_SEARCH_BAR
    );
  }

  onChange(event: any) {
    this.valueChange.emit(event.detail.value);
  }
}
