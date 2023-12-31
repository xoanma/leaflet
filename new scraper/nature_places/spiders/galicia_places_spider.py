from scrapy import Spider
from scrapy.http import Response
from dataclasses import dataclass
from typing import Any, List, Optional, Text
from scrapy.selector.unified import SelectorList, Selector
from shared.file_reader import plain_text_file_as_list
from bs4 import BeautifulSoup


@dataclass
class GaliciaNaturePlace:
    url: Text
    title: Text
    description: Optional[Text]
    images: List[Text]
    acceso: Optional[Text]


class GaliciaPlacesSpider(Spider):
    name = "galicia_places_spider"

    def __init__(self, **kwargs: Any):
        super(GaliciaPlacesSpider, self).__init__(**kwargs)
        self.start_urls = plain_text_file_as_list('data_sources/galicia_places.txt')

    def __extract_title(self, response: Response) -> Optional[Text]:
        title_selectors = response.css('h1.title::text')
        return title_selectors[0].extract() if title_selectors else None

    def __extract_description(self, response: Response) -> Optional[Text]:
        description_selectors = response.css('div.desplegadora')
        if description_selectors:
            html_data = description_selectors.extract_first()
            soup = BeautifulSoup(html_data, 'html.parser')
            texto_limpio = soup.get_text(separator=' ', strip=True)
            return texto_limpio
        return None

    def __extract_acceso(self, response: Response) -> Optional[Text]:
        acceso_selectors = response.css('div.situacion-acceso')
        if acceso_selectors:
            html_data = acceso_selectors.extract_first()
            soup = BeautifulSoup(html_data, 'html.parser')
            texto_limpio = soup.get_text(separator=' ', strip=True)
            return texto_limpio
        return None

    def __extract_image_gallery(self, response: Response) -> List[Text]:
        gallery_items_selector: List[Selector] = response.css('span.lazyOwl::attr(data-src)')
        if not gallery_items_selector:
            return []
        image_paths = set()
        for image in gallery_items_selector:
            image_paths.add(image.extract())
        return list(image_paths)

    def parse(self, response: Response, **kwargs: Any) -> Any:
        url = response.request.url
        title = self.__extract_title(response)
        description = self.__extract_description(response)
        images = self.__extract_image_gallery(response)
        acceso = self.__extract_acceso(response)
        yield GaliciaNaturePlace(url, title, description, images, acceso)
